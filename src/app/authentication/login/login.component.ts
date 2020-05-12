import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from 'src/app/shared/services/user.service';
import { filter } from 'rxjs/operators';
import { PreviousRouteService } from 'src/app/shared/services/previous-route.service';
import { AuthService } from 'src/app/shared/services/authentication.service';

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

    constructor(
        private userService: UserService,
        private router: Router,
        private fb: FormBuilder,
        public ngZone: NgZone, // NgZone service to remove outside scope warning
        public afAuth: AngularFireAuth,
        public authService: AuthService,
        public previousRoute: PreviousRouteService
    ) {

        console.log(this.previousRoute.getPreviousUrl());
    }

    async ngOnInit(): Promise<void> {
        this.afAuth.onAuthStateChanged(user => {
            if (user) {
                this.getUserInfo(user.uid);
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

    async onLogin() {
        try {
            await this.afAuth.signInWithEmailAndPassword(this.loginForm.get('email').value, this.loginForm.get('password').value);
            this.navigateToUserProfile();
        } catch (error) {
            this.errorMessage = error.message;
            this.showError = true;
            if (error.code == "auth/wrong-password") {
                this.errorLogin = true;
            }
            else if (error.code == "auth/user-not-found") {
                this.errorLogin = true;
            }
        }

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
            this.router.navigate(["app/settings/profile-settings"]);
        });
    }
    private getUserInfo(uid: string) {
        this.userService.getUser(uid).subscribe(snapshot => {
            this.user = snapshot;
            this.userService.saveUser(this.user);
            this.authService.SetUserData(this.user);

        });
    }


}


