import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { combineLatest, Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { PreviousRouteService } from 'src/app/shared/services/previous-route.service';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { LanguageService } from 'src/app/shared/services/language.service';
import { Language } from 'src/app/shared/interfaces/language.type';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  recaptchaElement;
  isCaptchaElementReady: boolean = false;
  invalidCaptcha: boolean = false;
  captchaToken: string;
  invalidCaptchaErr: string = "";
  isCapchaScriptLoaded: boolean = false;
  capchaObject;
  languageList: Language[];
  selectedLanguage: string;

  @ViewChild('recaptcha') set SetThing(e: LoginComponent) {
      this.isCaptchaElementReady = true;
      this.recaptchaElement = e;
      if (this.isCaptchaElementReady && this.isCapchaScriptLoaded) {
          this.renderReCaptcha();
      }
  }

  errorMessage: string;
  paswordErr: boolean = false;
  showError: boolean;
  loginForm: FormGroup;
  passwordForm: FormGroup;
  errorLogin: boolean = false;
  user: any;
  passExpired: boolean = false;
  previousUrl: string;
  isFormSaving: boolean = false;
  invalidPassErr: string = "";
  invalidCredErr: string = "";
  somethingWentWrongErr: string = "";
  enablePasswordChangeScreen: boolean = false;
  enableEmailVerificationScreen: boolean = false;
  logginUserDetails;
  memberDetails;
  userDetails;
  userDataSubs: Subscription;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public afAuth: AngularFireAuth,
    public authService: AuthService,
    public previousRoute: PreviousRouteService,
    public translate: TranslateService,
    private location: Location,
    private languageService: LanguageService,
    private userService: UserService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.languageList = this.languageService.geLanguageList();
    this.selectedLanguage = this.languageService.defaultLanguage;

    this.addRecaptchaScript();
    this.invalidPassErr = this.translate.instant("invalidPassErr");
    this.invalidCredErr = this.translate.instant("invalidCredErr");
    this.somethingWentWrongErr = this.translate.instant("somethingWrongErr");
    this.invalidCaptchaErr = this.translate.instant("invalidCaptchaErr");
    this.translate.onLangChange.subscribe((_event: LangChangeEvent) => {
        this.invalidPassErr = this.translate.instant("invalidPassErr");
        this.invalidCredErr = this.translate.instant("invalidCredErr");
        this.somethingWentWrongErr = this.translate.instant("somethingWrongErr");
        this.somethingWentWrongErr = this.translate.instant("invalidCaptchaErr");
    })
    this.buildLoginForm();
  }

  switchLang(lang: string) {
    this.languageService.changeLangOnBoarding(lang);
  }

  buildLoginForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
    this.passwordForm = this.fb.group({
      password: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,30}$/)]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
    });
  }

  onLogin() {
    this.isFormSaving = true;
    const userData = {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value
    }
    this.authService.doLogin(userData.email, userData.password).then((loginDetails) => {
      if (!loginDetails.user.emailVerified) {
        this.showEmailVerification();
      } else {
        let memberSubs = this.authService.getMember(loginDetails.user.uid);
        let userSubs = this.authService.get(loginDetails.user.uid);
        this.userDataSubs = combineLatest(
          memberSubs,
          userSubs
        ).subscribe((finalResule) => {
          if (finalResule[0] && finalResule[1]) {
            this.memberDetails = finalResule[0];
            this.userDetails = finalResule[1];
            this.validatePassAndNext(userData);
          }
        })
      }
      this.isFormSaving = false;
    }).catch((err) => {
      this.resetCaptcha();

      if (err.code == "auth/wrong-password") {
        this.errorMessage = this.invalidPassErr;
        this.errorLogin = true;
        this.isFormSaving = false;
      } else {

        try {
          this.checkDejangoCred(userData).subscribe((_djangoData: any) => {
            this.resetCaptcha();
            this.isFormSaving = false;
            this.errorMessage = this.translate.instant("PasswordExpired");
            this.showError = true;
            this.passExpired = true;
          }, _error => {
            this.resetCaptcha();
            this.isFormSaving = false;
            this.errorMessage = this.invalidCredErr;
            this.showError = true;
            this.errorLogin = true;
          })
        } catch (error) {
          this.resetCaptcha();
          this.isFormSaving = false;
          this.errorMessage = this.somethingWentWrongErr;
          this.showError = true;
          this.errorLogin = true;
        }
      }
    })
  }

  submitForm() {
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }
    this.validateCaptcha();
  }

  validatePassAndNext(userData) {
    if (this.isPassValidationApproved(userData.password)) { //TODO: Remove validation on password

      if(this.memberDetails && this.memberDetails.hasOwnProperty("user_type") && !this.memberDetails.hasOwnProperty("type")) 
      {
        this.userService.updateBasicDetails(this.memberDetails.id, {
          type: this.memberDetails.user_type,
          user_type: this.memberDetails.user_type,
        });
      }

      if (this.isOnboardingProcessDone())
        this.navigateToUserProfile();
      else {
        const memberDetails = this.memberDetails;
        const userDetails = this.userDetails;
        if(!memberDetails.bio || !memberDetails.avatar || !memberDetails.avatar.url || !memberDetails.user_type)
          this.router.navigate(["auth/profile"]);
        else if(!userDetails.interests || userDetails.interests.length == 0)
          this.router.navigate(["auth/feed"]);
      }
    } else {
      this.enablePasswordChangeScreen = true;
    }
  }

  private navigateToUserProfile() {
    this.ngZone.run(() => {
      this.previousUrl = this.previousRoute.getPreviousUrl();
      if (this.previousUrl) {
        this.location.back();
      } else {
        if (this.userService.userData?.isNewConsoleUser) {
          this.authService.redirectToConsole(`${environment.consoleURL}/settings/profile-settings`, {})
        } else {
          this.router.navigate(["app/settings/profile-settings"]);
        }
      }
    });
  }

  checkDejangoCred(userDetails) {
    return this.authService.checkDejangoCred(userDetails)
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.passwordForm.controls.password.value) {
      return { confirm: true, error: true };
    }
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
      this.isFormSaving = true;
      this.invalidCaptcha = false;
      this.authService.validateCaptcha(this.captchaToken).subscribe((_success) => {
        this.onLogin();
      }, (_error) => {
        this.isFormSaving = false;
        this.errorMessage = this.invalidCaptchaErr;
        this.invalidCaptcha = true;
        this.resetCaptcha();
      })
    } else {
      this.errorMessage = this.invalidCaptchaErr;
      this.invalidCaptcha = true;
      this.resetCaptcha();
    }
  }

  isPassValidationApproved(passWord) {
    /* const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,30}$/;
    return pattern.test(passWord); */
    return true;
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.passwordForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  resetCaptcha() {
    window['grecaptcha'].reset(this.capchaObject);
    this.captchaToken = ""
  }

  showEmailVerification() {
    this.router.navigate(['/auth/email-verify']);
    this.enableEmailVerificationScreen = true;
    setTimeout(() => {
      this.enableEmailVerificationScreen = false;
    }, 6000);
  }

  isOnboardingProcessDone() {
    const memberDetails = this.memberDetails;
    const userDetails = this.userDetails;
    if (
      !memberDetails.bio || !memberDetails.avatar || !memberDetails.user_type
      || !userDetails.interests || userDetails.interests.length == 0 || !memberDetails.avatar.url
    )
      return false;
    else
      return true;
  }

  ngOnDestroy() {
    if (this.userDataSubs)
      this.userDataSubs.unsubscribe()
  }

}
