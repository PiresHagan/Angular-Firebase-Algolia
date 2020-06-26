import { Component, NgZone, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from 'src/app/shared/services/user.service';
import { PreviousRouteService } from 'src/app/shared/services/previous-route.service';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { LanguageService } from 'src/app/shared/services/language.service';
import { environment } from "src/environments/environment";

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    recaptchaElement;
    isCaptchaElementReady: boolean = false;
    @ViewChild('recaptcha') set SetThing(e: LoginComponent) {
        this.isCaptchaElementReady = true;
        this.recaptchaElement = e;
        if (this.isCaptchaElementReady && this.isCapchaScriptLoaded) {
            this.renderReCaptcha();
        }
    }
    //@ViewChild('recaptcha', { static: true }) recaptchaElement: ElementRef;
    errorMessage: string;
    paswordErr: boolean = false;
    showError: boolean;
    loginForm: FormGroup;
    passwordForm: FormGroup;
    errorLogin: boolean = false;
    invalidCaptcha: boolean = false;
    user: any;
    captchaToken: string;
    previousUrl: string;
    isFormSaving: boolean = false;
    invalidPassErr: string = "";
    invalidCredErr: string = "";
    invalidCaptchaErr: string = "";
    somethingWentWrongErr: string = "";
    enablePasswordChangeScreen: boolean = false;
    isCapchaScriptLoaded: boolean = false;


    constructor(
        private userService: UserService,
        private router: Router,
        private fb: FormBuilder,
        public ngZone: NgZone, // NgZone service to remove outside scope warning
        public afAuth: AngularFireAuth,
        public authService: AuthService,
        public previousRoute: PreviousRouteService,
        public translate: TranslateService,
        private language: LanguageService
    ) {


    }

    async ngOnInit(): Promise<void> {

        this.addRecaptchaScript();
        this.invalidPassErr = this.translate.instant("invalidPassErr");
        this.invalidCredErr = this.translate.instant("invalidCredErr");
        this.somethingWentWrongErr = this.translate.instant("somethingWrongErr");
        this.invalidCaptchaErr = this.translate.instant("invalidCaptchaErr");
        this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
            this.invalidPassErr = this.translate.instant("invalidPassErr");
            this.invalidCredErr = this.translate.instant("invalidCredErr");
            this.somethingWentWrongErr = this.translate.instant("somethingWrongErr");
            this.somethingWentWrongErr = this.translate.instant("invalidCaptchaErr");
        })
        this.buildLoginForm();
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
        this.authService.doLogin(userData.email, userData.password).then(() => {
            this.isFormSaving = false;
            this.validatePassAndNext(userData);

        }).catch((err) => {

            if (err.code == "auth/wrong-password") {
                this.errorMessage = this.invalidPassErr;
                this.errorLogin = true;
                this.isFormSaving = false;
            } else {

                try {
                    this.checkDejangoCred(userData).subscribe((djangoData) => {
                        this.authService.doLogin(userData.email, userData.password).then(() => {
                            this.isFormSaving = false;
                            this.validatePassAndNext(userData);

                        })
                    }, error => {
                        this.isFormSaving = false;
                        this.errorMessage = this.invalidCredErr;
                        this.showError = true;
                        this.errorLogin = true;
                    })
                } catch (error) {
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
        if (this.isPassValidationApproved(userData.password)) {
            this.navigateToUserProfile()
        } else {
            this.enablePasswordChangeScreen = true;
        }
    }

    private navigateToUserProfile() {
        this.ngZone.run(() => {
            this.previousUrl = this.previousRoute.getPreviousUrl();
            this.router.navigate([this.previousUrl ? this.previousUrl : "app/settings/profile-settings"]);
        });

    }
    checkDejangoCred(userDetails) {
        return this.authService.checkDejangoCred(userDetails)
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
        window['grecaptcha'].render(this.recaptchaElement.nativeElement, {
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
    validateCaptcha() {
        // this.onLogin();
        // return
        if (this.captchaToken) {
            this.isFormSaving = true;
            this.invalidCaptcha = false;
            this.authService.validateCaptcha(this.captchaToken).subscribe((success) => {
                this.onLogin();
            }, (error) => {
                this.isFormSaving = false;
                this.errorMessage = this.invalidCaptchaErr;
                this.invalidCaptcha = true;

            })
        } else {
            this.errorMessage = this.invalidCaptchaErr;
            this.invalidCaptcha = true;
        }



    }
    isPassValidationApproved(passWord) {
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,30}$/;
        return pattern.test(passWord);
    }
    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else if (control.value !== this.passwordForm.controls.password.value) {
            return { confirm: true, error: true };
        }
    }
    resetPassword() {
        for (const i in this.passwordForm.controls) {
            this.passwordForm.controls[i].markAsDirty();
            this.passwordForm.controls[i].updateValueAndValidity();
        }

        if (this.findInvalidControls().length === 0) {
            this.isFormSaving = true;
            this.userService.updatePassword(this.passwordForm.get('password').value).then(() => {
                this.isFormSaving = false;
            }).catch(() => {
                this.paswordErr = true;
                this.errorMessage = this.somethingWentWrongErr
                this.isFormSaving = false;
            })
        }

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
}


