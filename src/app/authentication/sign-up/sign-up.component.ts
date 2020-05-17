import { Component } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import { UserService } from '../../shared/services/user.service';
import { User } from 'src/app/shared/interfaces/user.type';
import { AuthService } from 'src/app/shared/services/authentication.service';

@Component({
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent {

    signUpForm: FormGroup;
    errorSignup: boolean = false;
    errorPasswordWeak: boolean = false;
    errorAgree: boolean = false;


    constructor(
        private fb: FormBuilder,
        public afAuth: AngularFireAuth,
        private router: Router,
        private userService: UserService,
        private authService: AuthService
    ) {
    }

    ngOnInit(): void {
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
                    this.addUser({
                        displayName: fullname,
                        email: email,
                        uid: user.user.uid,
                        isAnonymous: false
                    })

                }).catch((error) => {
                    console.log("test...", error);
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
    addUser(userDetails) {
        this.userService.createUser(userDetails).then(() => {
            this.router.navigate(['/auth/profile']);
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
}    