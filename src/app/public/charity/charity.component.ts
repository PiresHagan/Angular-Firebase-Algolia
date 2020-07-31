import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { CharityService } from 'src/app/shared/services/charity.service';
import { LanguageService } from 'src/app/shared/services/language.service';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { Charity } from 'src/app/shared/interfaces/charity.type';
import { User } from 'src/app/shared/interfaces/user.type';

@Component({
  selector: 'app-charity',
  templateUrl: './charity.component.html',
  styleUrls: ['./charity.component.scss']
})

export class CharityComponent implements OnInit {
  charity: Charity;
  charityId: string;
  isFollowing: boolean = false;
  isLoaded: boolean = false;
  isLoggedInUser: boolean = false;
  selectedLanguage: string = "";
  userDetails: User;
  donateSuccess: boolean = false;
  isFormSaving: boolean = false;
  donateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private langService: LanguageService,
    private charityService: CharityService,
    private titleService: Title,
    private metaTagService: Meta
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
        amount: [null, [Validators.required]]
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
      if (data) {
        this.isFollowing = true;
      } else {
        this.isFollowing = false;
      }
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
      await this.charityService.followCharity(this.charityId).then(data => {
        this.setFollowOrNot();
      });
    }
  }

  async unfollow() {
    await this.setUserDetails();
    if(this.isLoggedInUser) {
      await this.charityService.unfollowCharity(this.charityId).then(data => {
        this.setFollowOrNot();
      });
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

    if (this.findInvalidControls().length == 0) {
      try {
        this.isFormSaving = true;
        
        setTimeout(() => {
          this.donateForm.reset();
          this.isFormSaving = false;
          this.donateSuccess = true;
          setTimeout(() => {
            this.donateSuccess = false;
          }, 3000);
        }, 3000);

      } catch (err) {
        this.isFormSaving = false;
      }
    }
    else {
      this.isFormSaving = false;
    }
  }

}
