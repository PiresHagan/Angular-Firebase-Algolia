import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,  Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { LanguageService } from 'src/app/shared/services/language.service';
import {Location} from '@angular/common';
import { Language } from 'src/app/shared/interfaces/language.type';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  errorReset: boolean = false;
  successReset: boolean = false;
  languageList: Language[];
  selectedLanguage: string;

  constructor( 
    private fb: FormBuilder, 
    public afAuth: AngularFireAuth,
    private router: Router,
    public translate: TranslateService,
    private language: LanguageService,
    private _location: Location
  ) { }

  switchLang(lang: string) {
    this.language.changeLangOnBoarding(lang);
  }

  ngOnInit() {
    this.languageList = this.language.geLanguageList();

    this.selectedLanguage = this.language.defaultLanguage;

    this.resetPasswordForm = this.fb.group({
      email: [ null, [Validators.email, Validators.required] ]
    });
  }

  async submitForm() {
    for (const i in this.resetPasswordForm.controls) {
      this.resetPasswordForm.controls[ i ].markAsDirty();
      this.resetPasswordForm.controls[ i ].updateValueAndValidity();
    }

    this.errorReset = false;
    this.successReset = false;

    if(this.findInvalidControls().length == 0){
      try {
        const email = this.resetPasswordForm.get('email').value;

        await this.afAuth.sendPasswordResetEmail(email).then(() => {
          console.log("email sent");
          this.successReset = true;
        }).catch((error) => {
          console.log(error);
          this.errorReset = true;
        })
      } catch (err) {
        console.log("err...", err); 
      }
    }
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.resetPasswordForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  backClicked() {
    this._location.back();
  }

}
