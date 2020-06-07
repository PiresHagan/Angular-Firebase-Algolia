import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from 'src/app/shared/services/user.service';
import { PreviousRouteService } from 'src/app/shared/services/previous-route.service';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { LanguageService } from 'src/app/shared/services/language.service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    errorMessage: string;

    showError: boolean;

    loginForm: FormGroup;

    errorLogin: boolean = false;

    user: any;

    previousUrl: string;
    isFormSaving: boolean = false;

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
        this.afAuth.onAuthStateChanged(user => {
            if (user && !user.isAnonymous) {

                this.navigateToUserProfile();
            }
        });
        this.buildLoginForm();
    }

    buildLoginForm() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
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
            this.navigateToUserProfile();

        }).catch((err) => {
            this.checkDejangoCred(userData).then((djangoData) => {
                this.authService.doLogin(userData.email, userData.password).then(() => {
                    this.isFormSaving = false;
                    this.navigateToUserProfile();

                })
            }).catch((djangoError) => {
                this.isFormSaving = false;
                this.errorMessage = err.message;
                this.showError = true;
                if (err.code == "auth/wrong-password") {
                    this.errorLogin = true;
                }
                else if (err.code == "auth/user-not-found") {
                    this.errorLogin = true;
                }
            })

        })



    }

    submitForm() {
        for (const i in this.loginForm.controls) {
            this.loginForm.controls[i].markAsDirty();
            this.loginForm.controls[i].updateValueAndValidity();
        }
        this.onLogin()
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



}


