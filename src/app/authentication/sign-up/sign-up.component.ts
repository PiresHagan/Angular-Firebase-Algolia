import { Component } from '@angular/core'
import { FormBuilder, FormControl, FormGroup,  Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import { UserService } from '../../shared/services/user.service';
import { User } from 'src/app/shared/interfaces/user.type';

@Component({
    templateUrl: './sign-up.component.html'
})

export class SignUpComponent {

    signUpForm: FormGroup;
    errorSignup: boolean = false;
    errorPasswordWeak: boolean = false;
    errorAgree:boolean = false;


    constructor(
        private fb: FormBuilder, 
        public afAuth: AngularFireAuth,
        private router: Router,
        private userService: UserService,
        ) {
    }

    ngOnInit(): void {
        this.signUpForm = this.fb.group({
            fullname         : [ null, [ Validators.required ] ],
            email            : [ null, [Validators.email, Validators.required] ],
            password         : [ null, [ Validators.required ] ],
            checkPassword    : [ null, [ Validators.required, this.confirmationValidator ] ],
            agree            : [ null, [ Validators.required ]]
        });
    }

    async submitForm() {
        for (const i in this.signUpForm.controls) {
            this.signUpForm.controls[ i ].markAsDirty();
            this.signUpForm.controls[ i ].updateValueAndValidity();
        }

        this.errorSignup = false;
        this.errorPasswordWeak = false;
        this.errorAgree = false;

        if(this.findInvalidControls().length == 0){
            try {
                const email = this.signUpForm.get('email').value;
                const password = this.signUpForm.get('password').value;
                const fullname = this.signUpForm.get('fullname').value;
    
                this.afAuth.createUserWithEmailAndPassword(email, password).then(user =>{
                    console.log("user...", JSON.stringify(user));
                    user.user.updateProfile({ 
                        displayName: fullname
                      }).then( data =>{
                        let newuser = {} as User;
                        newuser.displayName = fullname;
                        newuser.email = email;
                        newuser.uid = user.user.uid;
                        newuser.isAnonymous = false;
    
                        this.userService.add(newuser).then(()=>{
                            this.router.navigate(['/auth/profile']);
                        });
    
                    }).catch( error => {
                    console.log(error);
                    });
                }).catch( error => {
                    console.log("test...",error);
                    if(error.code == "auth/email-already-in-use"){
                        this.errorSignup = true;
                        console.log(this.errorSignup);
                    }
                    else if(error.code == "auth/weak-password"){
                        this.errorPasswordWeak = true;
                    }
                   
                });
    
    
            } catch (err) {
                console.log("err...", err);
               
            }
        }
        else{
            if(this.findInvalidControls().indexOf('agree') > -1){
                this.errorAgree = true;
            }

        }
        
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