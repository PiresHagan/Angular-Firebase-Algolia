import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { environment } from 'src/environments/environment';
import { NzNotificationService } from 'ng-zorro-antd/notification';

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
  errorLogin: boolean = false;
  invalidPassErr: string = "";
  somethingWentWrongErr: string = "";
  errorMessage: string;
  errorSignup: boolean = false;
  errorPasswordWeak: boolean = false;
  errorAgree: boolean = false;
  generalError: boolean = false;
  errorDetails;

  signInForm: FormGroup;
  signUpForm: FormGroup;
  isFormSaving: boolean = false;

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    public translate: TranslateService,
    private notification: NzNotificationService
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

    this.signUpForm = this.fb.group({
      fullname: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,30}$/)]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      agree: [null, [Validators.required]]
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
            const email = this.signInForm.get('email').value;
            const password = this.signInForm.get('password').value;
            this.onSignIn(email, password);
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

  onSignIn(email: string, password: string) {
    this.isFormSaving = true;
    this.authService.doLogin(email, password).then((loginDetails) => {
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

  async onSignUp() {
    for (const i in this.signUpForm.controls) {
      this.signUpForm.controls[i].markAsDirty();
      this.signUpForm.controls[i].updateValueAndValidity();
    }

    this.errorSignup = false;
    this.errorPasswordWeak = false;
    this.errorAgree = false;

    if (this.findInvalidControls().length == 0) {
      try {
        const email = this.signUpForm.get('email').value;
        const password = this.signUpForm.get('password').value;
        const fullname = this.signUpForm.get('fullname').value;
        if (this.captchaToken) {
          this.isFormSaving = true;
          this.invalidCaptcha = false;
          this.authService.validateCaptcha(this.captchaToken).subscribe((success) => {
            this.saveDataOnServer(email, password, fullname)
          }, (error) => {
            window['grecaptcha'].reset(this.capchaObject);
            this.isFormSaving = false;
            this.invalidCaptcha = true;
          })
        } else {
          this.invalidCaptcha = true;
        }
      } catch (err) {
        this.isFormSaving = false;
        console.log("err...", err);
      }
    }
    else {
      this.isFormSaving = false;
      if (this.findInvalidControls().indexOf('agree') > -1) {
        this.errorAgree = true;
      }
    }
  }

  saveDataOnServer(email, password, fullname) {
    this.authService.doRegister(email, password, fullname).then(user => {
      this.notification.create(
        'warning',
        'Email Verification Required',
        'Please click on the link that has been sent to your email account to verify your email and continue the checkout process by login',
        { nzDuration: 0 }
      );
      this.onSignIn(email, password);
    }).catch((error) => {
      this.isFormSaving = false;
      if (error.error && error.error.code == "auth/email-already-exists") {
        this.errorSignup = true;
      }
      else if (error.error && error.error.code == "auth/weak-password") {
        this.errorPasswordWeak = true;
      } else {
        this.errorDetails = error && error.error && error.error.message;
      }
      setTimeout(() => {
        this.errorDetails = "";
        this.errorSignup = false;
        this.errorPasswordWeak = false;
      }, 6000);
    })
}

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
        return { required: true };
    } else if (control.value !== this.signUpForm.controls.password.value) {
        return { confirm: true, error: true };
    }
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.signUpForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    return invalid;
  }

}
