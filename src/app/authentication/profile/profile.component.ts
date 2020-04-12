import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService, NzMessageService, UploadFile } from 'ng-zorro-antd';
import { UserService } from '../../shared/services/user.service';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { compareAsc, format } from 'date-fns';
import { User } from 'src/app/shared/interfaces/user.type';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

    profileForm: FormGroup;
    changePWForm: FormGroup;
    avatarUrl: string = "";
    selectedCountry: any;
    selectedLanguage: any;
    currentUser: any;

    constructor(
      private fb: FormBuilder, 
      private router: Router, 
      private modalService: NzModalService, 
      private message: NzMessageService,
      private userService: UserService,
      ) 
    { }

    async ngOnInit() {
      this.profileForm = this.fb.group({
        phone         : [ null, [ Validators.required ] ],
        birth         : [ null, [ Validators.required ] ],
        biography     : [ null],
        later         :  [null]
      });


      await firebase.auth().onAuthStateChanged((user) => {
        console.log("currentUser", JSON.stringify(user));

        return new Promise(async resolve => {
          if (user != null) {
              this.currentUser = user;
              //console.log(user.photoURL);
              this.avatarUrl = user.photoURL;

              await this.userService.get(this.currentUser.uid).subscribe((data) => {
                //console.log("data", data);
                this.profileForm.controls['phone'].setValue(data.phone);
                if(!data.birth){
                  this.profileForm.controls['birth'].setValue("");
                }
                else{
                  this.profileForm.controls['birth'].setValue(new Date(Date.parse(data.birth)));
                }
                this.profileForm.controls['biography'].setValue(data.biography);
              });

              resolve();
            } else {
              this.router.navigate(['/login']);
            }
        });

      });
      
    }

    submitForm(): void {
      console.log("this.currentUser", this.currentUser);

      for (const i in this.profileForm.controls) {
          this.profileForm.controls[ i ].markAsDirty();
          this.profileForm.controls[ i ].updateValueAndValidity();
      }
      console.log(this.findInvalidControls());

      if(this.findInvalidControls().length == 0){
        //save 

        const phone = this.profileForm.get('phone').value;
        const birth = format(this.profileForm.get('birth').value, 'yyyy/MM/dd');
        const biography = this.profileForm.get('biography').value;

        let newuser = {} as User;
        newuser.phone = phone;
        newuser.birth = birth;
        newuser.biography = biography;

        let fields: any = { phone: phone, birth: birth, biography:biography };
       
        //console.log(this.currentUser.uid);

        this.userService.update(this.currentUser.uid, fields).then(()=>{
          this.router.navigate(['/auth/interest']);
        });
      }
    }

    updateConfirmValidator(): void {
      Promise.resolve().then(() => this.profileForm.controls.checkPassword.updateValueAndValidity());
    }

    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else if (control.value !== this.profileForm.controls.password.value) {
            return { confirm: true, error: true };
        }
    }

    private getBase64(img: File, callback: (img: {}) => void): void {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    handleChange(info: { file: UploadFile }): void {
        this.getBase64(info.file.originFileObj, (img: string) => {
            this.avatarUrl = img;
            //console.log("this.avatarUrl",this.avatarUrl);

            const uploadTask = firebase.storage().ref('avatar/'+this.currentUser.email).putString(this.avatarUrl,'data_url').then(image => {
              //console.log('Image uploaded...');
              //console.log(image);
    
              // get url photo
              image.ref.getDownloadURL().then(downloadURL => {
                console.log("File available at", downloadURL);
                //this.imageLoading = false;
    
                // update user's profile picture
                firebase.auth().currentUser.updateProfile({
                  photoURL: downloadURL
                }).then(() => {});
              });
            });
        });
    }

    public findInvalidControls() {
      const invalid = [];
      const controls = this.profileForm.controls;
      for (const name in controls) {
          if (controls[name].invalid) {
              invalid.push(name);
          }
      }
      return invalid;
    }

}
