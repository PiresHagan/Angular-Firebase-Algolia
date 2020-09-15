import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LanguageService } from 'src/app/shared/services/language.service';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { User } from 'src/app/shared/interfaces/user.type';
import { Company } from 'src/app/shared/interfaces/company.type';
import { CompanyService } from 'src/app/shared/services/company.service';
import { Title, Meta } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  company: Company;
  companyId: string;
  isFollowing: boolean = false;
  isLoaded: boolean = false;
  isLoggedInUser: boolean = false;
  isUpdatingFollow: boolean = false;
  selectedLanguage: string = "";
  userDetails: User;
  invalidCaptcha: boolean = false;
  addLeadSuccess: boolean = false;
  isFormSaving: boolean = false;
  addLeadForm: FormGroup;
  recaptchaElement;
  isCaptchaElementReady: boolean = false;
  isCapchaScriptLoaded: boolean = false;
  captchaToken: string;
  capchaObject;
  @ViewChild('recaptcha') set SetThing(e: CompanyComponent) {
      this.isCaptchaElementReady = true;
      this.recaptchaElement = e;
      if (this.isCaptchaElementReady && this.isCapchaScriptLoaded) {
          this.renderReCaptcha();
      }
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private langService: LanguageService,
    private companyService: CompanyService,
    private titleService: Title,
    private metaTagService: Meta,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.selectedLanguage = this.langService.getSelectedLanguage();

      const slug = params.get('slug');

      this.companyService.getCompanyBySlug(slug).subscribe(data => {
        this.company = data[0];

        this.companyId = this.company.id;

        this.setUserDetails();

        this.titleService.setTitle(`${this.company.name.substring(0, 69)}`);

        this.metaTagService.addTags([
          { name: "description", content: `${this.company.bio.substring(0, 154)}` },
          { name: "keywords", content: `${this.company.name}` },
          { name: "twitter:card", content: `${this.company.bio.substring(0, 154)}` },
          { name: "og:title", content: `${this.company.name}` },
          { name: "og:type", content: `company` },
          { name: "og:url", content: `${window.location.href}` },
          { name: "og:image", content: `${this.company.logo.url}` },
          { name: "og:description", content: `${this.company.bio.substring(0, 154)}` }
        ]);
      });

      this.addRecaptchaScript();

      this.addLeadForm = this.fb.group({
        first_name: [null, [Validators.required]],
        last_name: [null, [Validators.required]],
        email: [null, [Validators.email, Validators.required]], 
        mobile_number: [null, [Validators.required]]
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
    this.companyService.isUserFollowing(this.company.id, this.getUserDetails().id).subscribe((data) => {
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
      await this.companyService.followCompany(this.companyId).then(data => {
        this.setFollowOrNot();
      });
    }else{
      this.showModal()
    }
  }

  async unfollow() {
    await this.setUserDetails();
    if(this.isLoggedInUser) {
      this.isUpdatingFollow = true;
      await this.companyService.unfollowCompany(this.companyId).then(data => {
        this.setFollowOrNot();
      });
    }else{
      this.showModal()
    }
  }

  addRecaptchaScript() {
    window['grecaptchaCallback'] = () => {
      this.isCapchaScriptLoaded = true;
      if (this.isCapchaScriptLoaded && this.isCaptchaElementReady)
        this.renderReCaptcha(); 
      return;
    }

    (function (d, s, id, obj) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
          obj.isCapchaScriptLoaded = true;
          if (obj.isCapchaScriptLoaded && obj.isCaptchaElementReady)
              obj.renderReCaptcha(); return;
      }
      js = d.createElement(s); js.id = id;
      js.src = "https://www.google.com/recaptcha/api.js?onload=grecaptchaCallback&render=explicit";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'recaptcha-jssdk', this));
  }

  renderReCaptcha() {
    if (!this.recaptchaElement || this.capchaObject)
      return;

    this.capchaObject = window['grecaptcha'].render(this.recaptchaElement.nativeElement, {
      'sitekey': environment.captchaKey,
      'callback': (response) => {
        this.invalidCaptcha = false;
        this.captchaToken = response;
      },
      'expired-callback': () => {
        this.captchaToken = '';
      }
    });
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.addLeadForm.controls;

    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    return invalid;
  }

  submitForm() {
    for (const i in this.addLeadForm.controls) {
      this.addLeadForm.controls[i].markAsDirty();
      this.addLeadForm.controls[i].updateValueAndValidity();
    }

    if (this.findInvalidControls().length == 0) {
      try {
        if (this.captchaToken) {
          this.isFormSaving = true;
          this.invalidCaptcha = false;
          this.authService.validateCaptcha(this.captchaToken).subscribe((success) => {
            this.saveDataOnServer(this.addLeadForm.value);
          }, (error) => {
            window['grecaptcha'].reset(this.capchaObject);
            this.isFormSaving = false;
            this.invalidCaptcha = true;
          });
        } else {
            this.invalidCaptcha = true;
        }
      } catch (err) {
        this.isFormSaving = false;
      }
    }
    else {
      this.isFormSaving = false;
    }
  }

  saveDataOnServer(data) {
    this.companyService.createCompanyLead(this.companyId, data).then(data => {
      this.addLeadForm.reset();
      this.addLeadSuccess = true;
      this.isFormSaving = false;
      setTimeout(() => {
        this.addLeadSuccess = false;
      }, 5000);
      window['grecaptcha'].reset(this.capchaObject);
    }).catch((error) => {
      this.isFormSaving = false;
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
