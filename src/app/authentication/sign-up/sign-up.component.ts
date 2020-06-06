import { Component, NgZone } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import { UserService } from '../../shared/services/user.service';
import { User } from 'src/app/shared/interfaces/user.type';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { PreviousRouteService } from 'src/app/shared/services/previous-route.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { LanguageService } from 'src/app/shared/services/language.service';
@Component({
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent {

    signUpForm: FormGroup;
    errorSignup: boolean = false;
    errorPasswordWeak: boolean = false;
    errorAgree: boolean = false;
    generalError: boolean = false;


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

                this.navigateToUserProfile();
            }
        });
        this.signUpForm = this.fb.group({
            fullname: [null, [Validators.required]],
            email: [null, [Validators.email, Validators.required]],
            password: [null, [Validators.required]],
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
                this.authService.doRegister(email, password, fullname).then(user => {
                    const userData = user.user;
                    this.addUser({
                        email: email,
                        id: userData.uid,
                        created_at: new Date().toString(),
                        updated_at: new Date().toString(),
                        lang: ""
                    }, {
                        fullname: userData.displayName,
                        id: userData.uid,
                        created_at: new Date().toString(),
                        slug: this.getSlug(userData.displayName),
                        updated_at: new Date().toString(),
                        lang: ""
                    });

                }).catch((error) => {
                    if (error.code == "auth/email-already-in-use") {
                        this.errorSignup = true;
                        console.log(this.errorSignup);
                    }
                    else if (error.code == "auth/weak-password") {
                        this.errorPasswordWeak = true;
                    }
                })


            } catch (err) {
                console.log("err...", err);

            }
        }
        else {
            if (this.findInvalidControls().indexOf('agree') > -1) {
                this.errorAgree = true;
            }

        }

    }
    addUser(userDetails, memberData) {
        this.generalError = false;
        this.userService.createUser(userDetails, memberData).then(() => {
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
            const previousUrl = this.previousRoute.getPreviousUrl();
            this.router.navigate([previousUrl ? previousUrl : "app/settings/profile-settings"]);
        });
    }
    private getSlug(displayName: string) {
        return displayName.replace(/ /g, '-')?.toLowerCase();
    }
}    