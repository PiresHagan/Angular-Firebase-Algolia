import { Component } from '@angular/core'
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent {
    loginForm: FormGroup;
    errorLogin: boolean = false;

    constructor(
        private fb: FormBuilder, 
        public afAuth: AngularFireAuth,
        private router: Router) {
    }

    async ngOnInit(): Promise<void> {
        this.loginForm = this.fb.group({
            email: [ '', [ Validators.required, Validators.email ] ],
            password: [ '', [ Validators.required ] ]
        });

        await firebase.auth().onAuthStateChanged((user) => {    
            return new Promise(async resolve => {
                if (user != null) {
                    //Already login...
                    console.log("loggedin...", user);
                    this.router.navigate['/app'];
                    
                    //TODO redirect...
                    resolve();

                    
                } 
            });
    
        });
    }

    async submitForm() {
        for (const i in this.loginForm.controls) {
            this.loginForm.controls[ i ].markAsDirty();
            this.loginForm.controls[ i ].updateValueAndValidity();
        }

        try {
            const usercred = await this.afAuth.signInWithEmailAndPassword(this.loginForm.get('email').value, this.loginForm.get('password').value);
            console.log(usercred);

            //window.open('http://app.mytrendongstories.com', '_self');
        } catch (err) {
            console.log(err);
            if(err.code == "auth/wrong-password"){
                this.errorLogin = true;
            }
            else if(err.code == "auth/user-not-found"){
                this.errorLogin = true;
            }

        }
    }
}    