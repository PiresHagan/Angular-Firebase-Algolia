import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from "ng-zorro-antd";
import { StripeService, StripeCardNumberComponent } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions, PaymentIntent } from '@stripe/stripe-js';
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

  @ViewChild(StripeCardNumberComponent) card: StripeCardNumberComponent;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  constructor(
    private fb: FormBuilder,
    private charityService: CharityService,
    private stripeService: StripeService,
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
      message: [""]
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

    const cardElement: any = this.card.element;

    if (this.findInvalidControls().length == 0 && !cardElement._empty && !cardElement._invalid) {
      try {
        this.isFormSaving = true;

        const name = `${this.donateForm.get('first_name').value} ${this.donateForm.get('last_name').value}`;

        this.stripeService.createToken(cardElement, { name }).subscribe((result) => {
          if (result.token) {
            let donorData = JSON.parse(JSON.stringify(this.donateForm.value));
            donorData['charity_id'] = this.charityId;
            donorData['card_token'] = result.token.id;
            if(donorData.message.length == 0) {
              delete donorData.message;
            }

            this.charityService.donate(donorData, this.charityId).then(result => {
              this.donateForm.reset();
              this.card.element.clear();
              this.isFormSaving = false;
              this.donateSuccess = true;
              setTimeout(() => {
                this.donateSuccess = false;
              }, 10000);
            }).catch(err => {
              this.isFormSaving = false;
              this.showError("CharityAccountError");
            });
          } else if (result.error) {
            this.isFormSaving = false;
            this.showInvalidCardErr();
          }
        });
      } catch (err) {
        this.isFormSaving = false;
      }
    } else {
      if(cardElement._empty || cardElement._invalid) {
        this.showInvalidCardErr();
      }

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
