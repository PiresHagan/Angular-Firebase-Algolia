import { Component, NgZone, ViewChild } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import { UserService } from '../../shared/services/user.service';
import { User } from 'src/app/shared/interfaces/user.type';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { PreviousRouteService } from 'src/app/shared/services/previous-route.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { LanguageService } from 'src/app/shared/services/language.service';
import { environment } from "src/environments/environment";
import * as firebase from 'firebase/app';

@Component({
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent {
    recaptchaElement;
    isCaptchaElementReady: boolean = false;
    isCapchaScriptLoaded: boolean = false;
    invalidCaptcha: boolean = false;
    captchaToken: string;
    capchaObject;
    @ViewChild('recaptcha') set SetThing(e: SignUpComponent) {
        this.isCaptchaElementReady = true;
        this.recaptchaElement = e;
        if (this.isCaptchaElementReady && this.isCapchaScriptLoaded) {
            this.renderReCaptcha();
        }
    }
    isFormSaving: boolean = false;
    signUpForm: FormGroup;
    errorSignup: boolean = false;
    errorPasswordWeak: boolean = false;
    errorAgree: boolean = false;
    generalError: boolean = false;
    enableEmailVerificationScreen: boolean = false;


    constructor(
        private fb: FormBuilder,
        public afAuth: AngularFireAuth,
        private router: Router,
        private userService: UserService,
        private authService: AuthService,
        public ngZone: NgZone, // NgZone service to remove outside scope warning
        public previousRoute: PreviousRouteService,
        public translate: TranslateService,
        private language: LanguageService

    ) {
    }

    ngOnInit(): void {
        this.afAuth.onAuthStateChanged(user => {
            if (user && !user.isAnonymous) {

                //this.navigateToUserProfile();
            }
        });
        this.addRecaptchaScript();
        this.signUpForm = this.fb.group({
            fullname: [null, [Validators.required]],
            email: [null, [Validators.email, Validators.required]],
            password: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,30}$/)]],
            checkPassword: [null, [Validators.required, this.confirmationValidator]],
            agree: [null, [Validators.required]]
        });

    }

    async submitForm() {
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
                        // this.errorMessage = this.invalidCaptchaErr;
                        this.invalidCaptcha = true;

                    })
                } else {
                    //this.errorMessage = this.invalidCaptchaErr;
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
    addUser(userDetails, memberData) {
        this.generalError = false;
        this.userService.createUser(userDetails, memberData).then(() => {
            const analytics = firebase.analytics();
            analytics.logEvent("sign_up", {
                user_uid: memberData.id,
                user_name: memberData.fullname,
                language: memberData.lang,
                user_email: memberData.email,
            });

            this.router.navigate(['/auth/profile']);
        }).catch(() => {
            this.generalError = true;
            console.log('Something went wrong....');
        })
    }

    updateConfirmValidator(): void {
        Promise.resolve().then(() => this.signUpForm.controls.checkPassword.updateValueAndValidity());
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
    private navigateToUserProfile() {
        this.ngZone.run(() => {
            let previousUrl = this.previousRoute.getPreviousUrl();
            if ((previousUrl && previousUrl.indexOf('auth/login') > -1) || previousUrl == '/') {
                previousUrl = '';
            }
            this.router.navigate([previousUrl ? previousUrl : "app/settings/profile-settings"]);
        });
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

    saveDataOnServer(email, password, fullname) {
        this.authService.doRegister(email, password, fullname).then(user => {
            this.enableEmailVerificationScreen = true;
            setTimeout(() => {
                this.router.navigate(['/']);
            }, 6000);
            this.signUpForm.reset();
            this.isFormSaving = false;

        }).catch((error) => {
            this.isFormSaving = false;
            if (error.code == "auth/email-already-in-use") {
                this.errorSignup = true;
                console.log(this.errorSignup);
            }
            else if (error.code == "auth/weak-password") {
                this.errorPasswordWeak = true;
            }
        })
    }
}    