import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-shop-login',
  templateUrl: './shop-login.component.html',
  styleUrls: ['./shop-login.component.scss']
})
export class ShopLoginComponent implements OnInit {

  recaptchaElement;
  isCaptchaElementReady: boolean = false;
  invalidCaptcha: boolean = false;
  invalidCaptchaErr: string = "";
  isCapchaScriptLoaded: boolean = false;
  capchaObject;
  captchaToken: string;

  @ViewChild('recaptcha') set SetThing(e: ShopLoginComponent) {
      this.isCaptchaElementReady = true;
      this.recaptchaElement = e;
      if (this.isCaptchaElementReady && this.isCapchaScriptLoaded) {
          this.renderReCaptcha();
      }
  }

  showSignIn: boolean = true;
  invalidPassErr: string = "";
  somethingWentWrongErr: string = "";
  errorMessage: string;
  signInForm: FormGroup;
  signUpForm: FormGroup;
  errorLogin: boolean = false;
  isFormSaving: boolean = false;

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.addRecaptchaScript();

    this.invalidPassErr = this.translate.instant("invalidPassErr");
    this.somethingWentWrongErr = this.translate.instant("somethingWrongErr");
    this.invalidCaptchaErr = this.translate.instant("invalidCaptchaErr");

    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ShowSignIn(){
    this.showSignIn = true;
  }

  ShowSignUp(){
    this.showSignIn = false;
  }

  
  addRecaptchaScript() {
    window['grecaptchaCallback'] = () => {
      this.isCapchaScriptLoaded = true;
      if (this.isCapchaScriptLoaded && this.isCaptchaElementReady)
        this.renderReCaptcha(); return;
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
    if (!this.recaptchaElement)
      return;
    this.capchaObject = window['grecaptcha'].render(this.recaptchaElement.nativeElement, {
      'sitekey': environment.captchaKey,
      'callback': (response) => {
        this.invalidCaptcha = false;
        this.captchaToken = response;
      },
      'expired-callback': () => {
        this.invalidCaptcha = false;
        this.captchaToken = '';
      }
    });
  }

  validateCaptcha() {
    if (this.captchaToken) {
      if((this.signInForm.valid || this.signUpForm.valid)) {
        this.isFormSaving = true;
        this.invalidCaptcha = false;
        this.authService.validateCaptcha(this.captchaToken).subscribe((success) => {
          if(this.showSignIn) {
            this.onSignIn();
          } else {
            this.onSignUp();
          }
        }, (error) => {
          this.isFormSaving = false;
          this.errorMessage = this.invalidCaptchaErr;
          this.invalidCaptcha = true;
          this.resetCaptcha();
        })
      }
    } else {
      this.errorMessage = this.invalidCaptchaErr;
      this.invalidCaptcha = true;
    }
  }

  resetCaptcha() {
    window['grecaptcha'].reset(this.capchaObject);
    this.captchaToken = ""
  }

  submitSignInForm() {
    for (const i in this.signInForm.controls) {
      this.signInForm.controls[i].markAsDirty();
      this.signInForm.controls[i].updateValueAndValidity();
    }

    this.validateCaptcha();
  }

  onSignIn() {
    this.isFormSaving = true;
    const userData = {
        email: this.signInForm.get('email').value,
        password: this.signInForm.get('password').value
    }
    this.authService.doLogin(userData.email, userData.password).then((loginDetails) => {
        this.isFormSaving = false;
    }).catch((err) => {
      this.resetCaptcha();

      this.isFormSaving = false;
      this.errorMessage = this.somethingWentWrongErr;
      this.errorLogin = true;

      if (err.code == "auth/wrong-password") {
          this.errorMessage = this.invalidPassErr;
          this.errorLogin = true;
          this.isFormSaving = false;
      }
    });
  }

  onSignUp() {

  }
}
