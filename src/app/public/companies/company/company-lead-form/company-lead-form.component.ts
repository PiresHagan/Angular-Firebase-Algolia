import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../../../shared/services/authentication.service';
import { environment } from 'src/environments/environment';
import { CompanyService } from 'src/app/shared/services/company.service';

@Component({
  selector: 'app-company-lead-form',
  templateUrl: './company-lead-form.component.html',
  styleUrls: ['./company-lead-form.component.scss']
})
export class CompanyLeadFormComponent implements OnInit {

  @Input() companyId: string;

  addLeadForm: FormGroup;
  addLeadSuccess: boolean = false;
  isFormSaving: boolean = false;

  recaptchaElement;
  isCaptchaElementReady: boolean = false;
  isCapchaScriptLoaded: boolean = false;
  captchaToken: string;
  capchaObject;
  invalidCaptcha: boolean = false;

  @ViewChild('recaptcha') set SetThing(e: CompanyLeadFormComponent) {
    this.isCaptchaElementReady = true;
    this.recaptchaElement = e;
    if (this.isCaptchaElementReady && this.isCapchaScriptLoaded) {
        this.renderReCaptcha();
    }
  } 

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private companyService: CompanyService,
  ) { }

  ngOnInit(): void {

    this.addLeadForm = this.fb.group({
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]], 
      mobile_number: [null, [Validators.required]]
    });

    this.addRecaptchaScript();

  }

  submitForm() {
    for (const i in this.addLeadForm.controls) {
      this.addLeadForm.controls[i].markAsDirty();
      this.addLeadForm.controls[i].updateValueAndValidity();
    }

    if (this.findInvalidControls().length == 0) {
      try {
        if (this.captchaToken) {
          this.isFormSaving = true;
          this.invalidCaptcha = false;
          this.authService.validateCaptcha(this.captchaToken).subscribe((success) => {
            this.saveDataOnServer(this.addLeadForm.value);
          }, (error) => {
            window['grecaptcha'].reset(this.capchaObject);
            this.isFormSaving = false;
            this.invalidCaptcha = true;
          });
        } else {
            this.invalidCaptcha = true;
        }
      } catch (err) {
        this.isFormSaving = false;
      }
    }
    else {
      this.isFormSaving = false;
    }
  }

  saveDataOnServer(data) {
    this.companyService.createCompanyLead(this.companyId, data).then(data => {
      this.addLeadForm.reset();
      this.addLeadSuccess = true;
      this.isFormSaving = false;
      setTimeout(() => {
        this.addLeadSuccess = false;
      }, 5000);
      window['grecaptcha'].reset(this.capchaObject);
    }).catch((error) => {
      this.isFormSaving = false;
    });
  }

  addRecaptchaScript() {
    window['grecaptchaCallback'] = () => {
      this.isCapchaScriptLoaded = true;
      if (this.isCapchaScriptLoaded && this.isCaptchaElementReady)
        this.renderReCaptcha(); 
      return;
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
    if (!this.recaptchaElement || this.capchaObject)
      return;

    this.capchaObject = window['grecaptcha'].render(this.recaptchaElement.nativeElement, {
      'sitekey': environment.captchaKey,
      'callback': (response) => {
        this.invalidCaptcha = false;
        this.captchaToken = response;
      },
      'expired-callback': () => {
        this.captchaToken = '';
      }
    });
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.addLeadForm.controls;

    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    return invalid;
  }

}
