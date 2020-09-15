import { ActivatedRoute, Router} from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { CharityService } from 'src/app/shared/services/charity.service';
import { LanguageService } from 'src/app/shared/services/language.service';
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from 'src/app/shared/services/authentication.service';
import { NzModalService } from "ng-zorro-antd";
import { Charity } from 'src/app/shared/interfaces/charity.type';
import { User } from 'src/app/shared/interfaces/user.type';

import { StripeService, StripeCardNumberComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions,
  PaymentIntent,
} from '@stripe/stripe-js';

@Component({
  selector: 'app-charity',
  templateUrl: './charity.component.html',
  styleUrls: ['./charity.component.scss']
})

export class CharityComponent implements OnInit {
  charity: Charity;
  charityId: string;
  isUpdatingFollow: boolean = false;
  isFollowing: boolean = false;
  isLoaded: boolean = false;
  isLoggedInUser: boolean = false;
  selectedLanguage: string = "";
  userDetails: User;
  donateSuccess: boolean = false;
  isFormSaving: boolean = false;
  donateForm: FormGroup;
  showInvalidCardError: boolean = false;

  @ViewChild(StripeCardNumberComponent) card: StripeCardNumberComponent;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private langService: LanguageService,
    private charityService: CharityService,
    private titleService: Title,
    private metaTagService: Meta, 
    private stripeService: StripeService,
    private modalService: NzModalService,
    public translate: TranslateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.selectedLanguage = this.langService.getSelectedLanguage();

      const slug = params.get('slug');

      this.charityService.getCharityBySlug(slug).subscribe(data => {
        this.charity = data[0];

        this.charityId = this.charity.id;

        this.setUserDetails();

        this.titleService.setTitle(`${this.charity.name.substring(0, 69)}`);

        this.metaTagService.addTags([
          { name: "description", content: `${this.charity.bio.substring(0, 154)}` },
          { name: "keywords", content: `${this.charity.name}` },
          { name: "twitter:card", content: `${this.charity.bio.substring(0, 154)}` },
          { name: "og:title", content: `${this.charity.name}` },
          { name: "og:type", content: `charity` },
          { name: "og:url", content: `${window.location.href}` },
          { name: "og:image", content: `${this.charity.logo.url}` },
          { name: "og:description", content: `${this.charity.bio.substring(0, 154)}` }
        ]);
      });

      this.donateForm = this.fb.group({
        first_name: [null, [Validators.required]],
        last_name: [null, [Validators.required]],
        email: [null, [Validators.email, Validators.required]], 
        mobile_number: [null, [Validators.required]], 
        amount: [null, [Validators.required, Validators.min(1)]],
        message: [""]
      });

      this.setUserDetails();
    });
  }

  ngAfterViewChecked(): void {
    if (!this.isLoaded) {
      delete window['addthis']
      setTimeout(() => { this.loadScript(); }, 100);
      this.isLoaded = true;
    }
  }

  loadScript() {
    let node = document.createElement('script');
    node.src = environment.addThisScript;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  async setUserDetails() {
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user) {
        this.userDetails = null;
        this.isLoggedInUser = false;
        return;
      }

      this.userDetails = await this.authService.getLoggedInUserDetails();

      if (this.userDetails) {
        this.isLoggedInUser = true;
        this.setFollowOrNot();
      } else {
        this.userDetails = null;
        this.isLoggedInUser = false;
      }
    })
  }


  setFollowOrNot() {
    this.charityService.isUserFollowing(this.charityId, this.getUserDetails().id).subscribe((data) => {
      setTimeout(() => {
        if (data) {
          this.isFollowing = true;
          this.isUpdatingFollow = false;
        } else {
          this.isFollowing = false;
          this.isUpdatingFollow = false;
        }
      }, 1500);
    });
  }

  getUserDetails() {
    return {
      fullname: this.userDetails.fullname,
      slug: this.userDetails.slug ? this.userDetails.slug : '',
      avatar: this.userDetails.avatar ? this.userDetails.avatar : '',
      id: this.userDetails.id,
    }
  }

  async follow() {
    await this.setUserDetails();
    if(this.isLoggedInUser) {
      this.isUpdatingFollow = true;
      await this.charityService.followCharity(this.charityId);
    }else{
      this.showModal()
    }
  }

  async unfollow() {
    await this.setUserDetails();
    if(this.isLoggedInUser) {
      this.isUpdatingFollow = true;
      await this.charityService.unfollowCharity(this.charityId);
    }else{
      this.showModal()
    }
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.donateForm.controls;

    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    return invalid;
  }

  submitForm() {
    for (const i in this.donateForm.controls) {
      this.donateForm.controls[i].markAsDirty();
      this.donateForm.controls[i].updateValueAndValidity();
    }

    const cardElement: any = this.card.element;

    if (this.findInvalidControls().length == 0 && !cardElement._empty && !cardElement._invalid) {
      try {
        this.isFormSaving = true;

        const name = `${this.donateForm.get('first_name').value} ${this.donateForm.get('last_name').value}`;

        this.stripeService.createToken(cardElement, { name }).subscribe((result) => {
          if (result.token) {
            let donorData = JSON.parse(JSON.stringify(this.donateForm.value));
            donorData['charity_id'] = this.charityId;
            donorData['card_token'] = result.token.id;
            if(donorData.message.length == 0) {
              delete donorData.message;
            }

            this.charityService.donate(donorData, this.charityId).then(result => {
              this.donateForm.reset();
              this.card.element.clear();
              this.isFormSaving = false;
              this.donateSuccess = true;
              setTimeout(() => {
                this.donateSuccess = false;
              }, 10000);
            }).catch(err => {
              this.isFormSaving = false;
              this.showError("CharityAccountError");
            });
          } else if (result.error) {
            this.isFormSaving = false;
            this.showInvalidCardErr();
          }
        });
      } catch (err) {
        this.isFormSaving = false;
      }
    } else {
      if(cardElement._empty || cardElement._invalid) {
        this.showInvalidCardErr();
      }

      this.isFormSaving = false;
    }
  }

  showInvalidCardErr() {
    this.showInvalidCardError = true;

    setTimeout(()=> {
      this.showInvalidCardError = false;
    }, 3000);
  }

  showError(errorMessage) {
    const msg = this.translate.instant(errorMessage);
    this.modalService.error({
      nzTitle: "<i>" + msg + "</i>",
    });
  }

  isVisible = false;
  isOkLoading = false;
  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.router.navigate(["auth/login"]);
      this.isOkLoading = false;
    }, 2000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
