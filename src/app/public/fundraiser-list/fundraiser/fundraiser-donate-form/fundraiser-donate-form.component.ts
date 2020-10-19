import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from "ng-zorro-antd";
import { StripeService, StripeCardNumberComponent } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { TranslateService } from "@ngx-translate/core";

import { FundraiserService } from 'src/app/shared/services/fundraiser.service';

@Component({
  selector: 'app-fundraiser-donate-form',
  templateUrl: './fundraiser-donate-form.component.html',
  styleUrls: ['./fundraiser-donate-form.component.scss']
})

export class FundraiserDonateFormComponent implements OnInit {

  @Input() fundraiserId: string;

  donateForm: FormGroup;
  donateSuccess: boolean = false;
  isFormSaving: boolean = false;
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
    private fundraiserService: FundraiserService,
    private modalService: NzModalService,
    private stripeService: StripeService,
    public translate: TranslateService
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
            donorData['fundraiser_id'] = this.fundraiserId;
            donorData['card_token'] = result.token.id;
            if (donorData.message.length == 0) {
              delete donorData.message;
            }

            this.fundraiserService.donate(donorData, this.fundraiserId).then(result => {
              this.donateForm.reset();
              this.card.element.clear();
              this.isFormSaving = false;
              this.donateSuccess = true;
              setTimeout(() => {
                this.donateSuccess = false;
              }, 10000);
            }).catch(err => {
              this.isFormSaving = false;
              this.showError("FundraiserAccountError");
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
      if (cardElement._empty || cardElement._invalid) {
        this.showInvalidCardErr();
      }

      this.isFormSaving = false;
    }
  }

  showInvalidCardErr() {
    this.showInvalidCardError = true;

    setTimeout(() => {
      this.showInvalidCardError = false;
    }, 3000);
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

  showError(errorMessage) {
    const msg = this.translate.instant(errorMessage);
    this.modalService.error({
      nzTitle: "<i>" + msg + "</i>",
    });
  }

}
