import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,  Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { LanguageService } from 'src/app/shared/services/language.service';
import {Location} from '@angular/common';
import { Language } from 'src/app/shared/interfaces/language.type';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  recaptchaElement;
  isFormSaving: boolean = false;
  isCaptchaElementReady: boolean = false;
  invalidCaptcha: boolean = false;
  captchaToken: string;
  invalidCaptchaErr: string = "";
  isCapchaScriptLoaded: boolean = false;
  capchaObject;

  resetPasswordForm: FormGroup;
  successReset: boolean = false;
  languageList: Language[];
  selectedLanguage: string;

  @ViewChild('recaptcha') set SetThing(e: ResetPasswordComponent) {
    this.isCaptchaElementReady = true;
    this.recaptchaElement = e;
    if (this.isCaptchaElementReady && this.isCapchaScriptLoaded) {
        this.renderReCaptcha();
    }
  }

  constructor( 
    private fb: FormBuilder, 
    private authService: AuthService,
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
    this.addRecaptchaScript();
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

    this.validateCaptcha();
  }

  async checkEmail(){
    this.successReset = false;

    if(this.findInvalidControls().length == 0){
      try {
        const email = this.resetPasswordForm.get('email').value;

        await this.authService.sendPasswordResetEmail(email).then(() => {
          // console.log("email sent");
          this.successReset = true;
          this.isFormSaving = false;
        }).catch((error) => {
          // console.log(error);
          this.successReset = true;
          this.isFormSaving = false;
        })
      } catch (err) {
        this.isFormSaving = false;
        // console.log("err...", err); 
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
    if (!this.recaptchaElement)
      return;
    this.capchaObject = window['grecaptcha'].render(this.recaptchaElement.nativeElement, {
      'sitekey': environment.captchaKey,
      'callback': (response) => {
        this.invalidCaptcha = false;
        this.captchaToken = response;
      },
      'expired-callback': () => {
        this.invalidCaptcha = false;
        this.captchaToken = '';
      }
    });
  }

  validateCaptcha() {
    if (this.captchaToken) {
      this.isFormSaving = true;
      this.invalidCaptcha = false;
      this.authService.validateCaptcha(this.captchaToken).subscribe((_success) => {
        this.checkEmail();
      }, (_error) => {
        this.isFormSaving = false;
        this.invalidCaptcha = true;
        this.resetCaptcha();
      })
    } else {
      this.invalidCaptcha = true;
      this.resetCaptcha();
    }
  }

  resetCaptcha() {
    window['grecaptcha'].reset(this.capchaObject);
    this.captchaToken = ""
  }

}
