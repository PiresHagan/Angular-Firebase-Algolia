import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from "ng-zorro-antd";
import { TranslateService } from "@ngx-translate/core";

import { Charity } from 'src/app/shared/interfaces/charity.type';
import { CharityService } from 'src/app/shared/services/charity.service';

@Component({
  selector: 'app-charity-donate-form',
  templateUrl: './charity-donate-form.component.html',
  styleUrls: ['./charity-donate-form.component.scss']
})
export class CharityDonateFormComponent implements OnInit {

  @Input() charityId: string;
  @Input() charity: Charity;

  donateSuccess: boolean = false;
  isFormSaving: boolean = false;
  donateForm: FormGroup;
  showInvalidCardError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private charityService: CharityService,
    public translate: TranslateService,
    private modalService: NzModalService,
  ) { }

  ngOnInit(): void {
    this.donateForm = this.fb.group({
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]], 
      mobile_number: [null, [Validators.required]], 
      amount: [null, [Validators.required, Validators.min(1)]],
      message: [null, [Validators.required]],
    });

    if(!this.charity && this.charityId) {
      this.charityService.getCharityById(this.charityId).subscribe((charityData) => {
        this.charity = charityData;
      });
    }
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.donateForm.controls;

    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    return invalid;
  }

  submitForm() {
    for (const i in this.donateForm.controls) {
      this.donateForm.controls[i].markAsDirty();
      this.donateForm.controls[i].updateValueAndValidity();
    }

    if (this.findInvalidControls().length == 0) {
      try {
        this.isFormSaving = true;

        const name = `${this.donateForm.get('first_name').value} ${this.donateForm.get('last_name').value}`;

        let donorData = JSON.parse(JSON.stringify(this.donateForm.value));
        donorData['success_url'] = window && window.location && `${window.location.href}?donation=success` || '';
        donorData['cancel_url'] = window && window.location && `${window.location.href}?donation=error`|| '';
        if(donorData.message.length == 0) {
          delete donorData.message;
        }

        this.charityService.donate(donorData, this.charityId).then((redirectUrl: any) => {
          if (redirectUrl) {
            window && window.open(redirectUrl, '_self')
            this.donateForm.reset();
            this.isFormSaving = false;
          } else {
            this.isFormSaving = false;
            this.showError("CharityAccountError");
          }
        }).catch(err => {
          this.isFormSaving = false;
          this.showError("CharityAccountError");
        });
      } catch (err) {
        this.isFormSaving = false;
      }
    } else {
      this.isFormSaving = false;
    }
  }

  showInvalidCardErr() {
    this.showInvalidCardError = true;

    setTimeout(()=> {
      this.showInvalidCardError = false;
    }, 3000);
  }

  showError(errorMessage) {
    const msg = this.translate.instant(errorMessage);
    this.modalService.error({
      nzTitle: "<i>" + msg + "</i>",
    });
  }

}
