import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { FundraiserService } from 'src/app/shared/services/fundraiser.service';
import { LanguageService } from 'src/app/shared/services/language.service';
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from 'src/app/shared/services/authentication.service';
import { NzModalService } from "ng-zorro-antd";
import { Fundraiser } from 'src/app/shared/interfaces/fundraiser.type';
import { User } from 'src/app/shared/interfaces/user.type';
import { StripeService, StripeCardNumberComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { AuthorService } from 'src/app/shared/services/author.service';
// import { TEXT, AUDIO, VIDEO } from 'src/app/shared/constants/article-constants';
import { UserService } from 'src/app/shared/services/user.service';
import { CompanyService } from 'src/app/shared/services/company.service';
import { CharityService } from 'src/app/shared/services/charity.service';
import { SeoService } from 'src/app/shared/services/seo/seo.service';

@Component({
  selector: 'app-fundraiser',
  templateUrl: './fundraiser.component.html',
  styleUrls: ['./fundraiser.component.scss']
})

export class FundraiserComponent implements OnInit {
  fundraiser: Fundraiser;
  fundraiserAuthor;
  fundraiserId: string;
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
  donationPercentage: string = "0";
  authorFollowersCount: number = 0;
  // TEXT = TEXT;
  // AUDIO = AUDIO;
  // VIDEO = VIDEO;

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
    private fundraiserService: FundraiserService,
    private authorService: AuthorService,
    private stripeService: StripeService,
    private modalService: NzModalService,
    public translate: TranslateService,
    public userService: UserService,
    public companyService: CompanyService,
    public charityService: CharityService,
    private seoService: SeoService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.selectedLanguage = this.langService.getSelectedLanguage();

      const slug = params.get('slug');

      this.fundraiserService.getFundraiserBySlug(slug).subscribe(data => {
        this.fundraiser = data[0];

        this.fundraiserId = this.fundraiser.id;

        if (this.fundraiser.goal_amount && this.fundraiser.amount) {
          this.donationPercentage = ((this.fundraiser.amount / this.fundraiser.goal_amount) * 100).toFixed(1);
        }

        this.authorService.getAllFollowersByAuthorType(this.fundraiser.author.id, this.fundraiser.author.type).subscribe((followers) => {
          this.authorFollowersCount = followers.length;
        });

        if (this.fundraiser.author.type == 'charity') {
          this.charityService.getCharityById(this.fundraiser.author.id).subscribe(charity => {
            this.fundraiserAuthor = charity;
          });
        } else if (this.fundraiser.author.type == 'company') {
          this.companyService.getCompanyById(this.fundraiser.author.id).subscribe(company => {
            this.fundraiserAuthor = company;
          });
        } else {
          this.userService.getMember(this.fundraiser.author.id).subscribe(member => {
            this.fundraiserAuthor = member;
          });
        }

        this.setUserDetails();

        this.seoService.updateMetaTags({
          tabTitle: this.fundraiser.title?.substring(0, 69),
          description: this.fundraiser.meta?.description?.substring(0, 154),
          title: this.fundraiser.title,
          type: 'fundraiser',
          image: { url: this.fundraiser.logo?.url },
          keywords: this.fundraiser.meta?.keyword,
        });
      });

      this.donateForm = this.fb.group({
        first_name: [null, [Validators.required]],
        last_name: [null, [Validators.required]],
        email: [null, [Validators.email, Validators.required]],
        mobile_number: [null, [Validators.required]],
        amount: [null, [Validators.required, Validators.min(1)]],
        message: [""]
      });
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
    this.authorService.isUserFollowing(this.fundraiser.author.id, this.getUserDetails().id, this.fundraiser.author.type).subscribe((data) => {
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
    if (this.isLoggedInUser) {
      this.isUpdatingFollow = true;
      await this.authorService.follow(this.fundraiser.author.id, this.fundraiser.author.type);
    }else{
      this.showModal()
    }
  }

  async unfollow() {
    await this.setUserDetails();
    if (this.isLoggedInUser) {
      this.isUpdatingFollow = true;
      await this.authorService.unfollow(this.fundraiser.author.id, this.fundraiser.author.type);
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
            donorData['fundraiser_id'] = this.fundraiserId;
            donorData['card_token'] = result.token.id;
            if (donorData.message.length == 0) {
              delete donorData.message;
            }

            this.fundraiserService.donate(donorData, this.fundraiserId).then(result => {
              this.donateForm.reset();
              this.card.element.clear();
              this.isFormSaving = false;
              this.donateSuccess = true;
              setTimeout(() => {
                this.donateSuccess = false;
              }, 10000);
            }).catch(err => {
              this.isFormSaving = false;
              this.showError("FundraiserAccountError");
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
      if (cardElement._empty || cardElement._invalid) {
        this.showInvalidCardErr();
      }

      this.isFormSaving = false;
    }
  }

  showInvalidCardErr() {
    this.showInvalidCardError = true;

    setTimeout(() => {
      this.showInvalidCardError = false;
    }, 3000);
  }

  showError(errorMessage) {
    const msg = this.translate.instant(errorMessage);
    this.modalService.error({
      nzTitle: "<i>" + msg + "</i>",
    });
  }

  getAuthorUrl(fundraiser) {
    if (fundraiser.author.type == 'charity') {
      return '/charities/';
    } else if (fundraiser.author.type == 'company') {
      return '/companies/';
    } else {
      return '/'
    }
  }
  isVisible = false;
  isOkLoading = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isOkLoading = false;
    }, 2000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}

