import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import * as firebase from 'firebase/app';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { LanguageService } from 'src/app/shared/services/language.service';
@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})

export class NetworkComponent implements OnInit {

  networkForm: FormGroup;
  currentUser: any;


  networkList = [
    {
        name: 'Google',
        icon: 'google',
        avatarColor: '#4267b1',
        avatarBg: 'rgba(66, 103, 177, 0.1)',
        status: false,
        link: 'https://google.com',
        provider: 'appGoogleSignin'
    },
    /* {
        name: 'Facebook',
        icon: 'facebook',
        avatarColor: '#4267b1',
        avatarBg: 'rgba(66, 103, 177, 0.1)',
        status: true,
        link: 'https://facebook.com',
        provider: ''
    }, */
    /* {
        name: 'Instagram',
        icon: 'instagram',
        avatarColor: '#fff',
        avatarBg: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)',
        status: false,
        link: 'https://instagram.com',
        provider: ''
    }, */
    /* {
        name: 'Twitter',
        icon: 'twitter',
        avatarColor: '#1ca1f2',
        avatarBg: 'rgba(28, 161, 242, 0.1)',
        status: true,
        link: 'https://twitter.com',
        provider: ''
    }, */
    /* {
        name: 'Yahoo',
        icon: 'yahoo',
        avatarColor: '#1ca1f2',
        avatarBg: 'rgba(28, 161, 242, 0.1)',
        status: true,
        link: 'https://yahoo.com',
        provider: ''
    }, */
    /* {
        name: 'Linkedin',
        icon: 'linkedin',
        avatarColor: '#0174af',
        avatarBg: 'rgba(1, 116, 175, 0.1)',
        status: true,
        link: 'https://linkedin.com',
        provider: ''
    }, */
    /* {
        name: 'Pinterest',
        icon: 'pinterest',
        avatarColor: '#1ca1f2',
        avatarBg: 'rgba(28, 161, 242, 0.1)',
        status: true,
        link: 'https://pinterest.com',
        provider: ''
    }, */
    /* {
        name: 'Reddit',
        icon: 'reddit',
        avatarColor: '#323131',
        avatarBg: 'rgba(50, 49, 49, 0.1)',
        status: true,
        link: 'https://reddit.com',
        provider: ''
    }, */
    /* {
        name: 'Tumblr',
        icon: 'tumblr',
        avatarColor: '#005ef7',
        avatarBg: 'rgba(0, 94, 247, 0.1)',
        status: false,
        link: 'https://tumblr.com',
        provider: ''
    }, */
    /* {
        name: 'Imgur',
        icon: 'imgur',
        avatarColor: '#005ef7',
        avatarBg: 'rgba(0, 94, 247, 0.1)',
        status: false,
        link: 'https://imgur.com',
        provider: ''
    } */
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    public translate: TranslateService,
     private language: LanguageService

  ) { }

  async ngOnInit() {
    this.networkForm = this.fb.group({
      google  : [ null ],
    });

    await firebase.auth().onAuthStateChanged((user) => {
      console.log("currentUser", JSON.stringify(user));

      return new Promise(async resolve => {
        if (user != null) {
            this.currentUser = user;
            await this.userService.get(this.currentUser.uid).subscribe((data) => {
              //console.log("data", data.networks);
              if(data.networks){
                for (const network in data.networks){
                //console.log(network);
                  this.networkForm.controls[network].setValue(network);
                }
              }
              
            });
            resolve();
          } else {
            this.router.navigate(['/login']);
          }
      
      });

    });

    
  }

  submitForm(): void {
    /* for (const i in this.networkForm.controls) {
        this.networkForm.controls[ i ].markAsDirty();
        this.networkForm.controls[ i ].updateValueAndValidity();
    } */

      this.router.navigate(['/interest']);
  }

  /* updateConfirmValidator(): void {
    Promise.resolve().then(() => this.networkForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
        return { required: true };
    } else if (control.value !== this.networkForm.controls.password.value) {
        return { confirm: true, error: true };
    }
  } */


}
