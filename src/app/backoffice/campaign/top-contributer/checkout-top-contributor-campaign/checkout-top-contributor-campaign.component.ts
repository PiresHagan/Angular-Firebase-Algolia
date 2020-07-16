

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CampaignService } from 'src/app/backoffice/shared/services/campaign.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/shared/services/language.service';

@Component({
  selector: 'app-checkout-top-contributor-campaign',
  templateUrl: './checkout-top-contributor-campaign.component.html',
  styleUrls: ['./checkout-top-contributor-campaign.component.css']
})
export class CheckoutTopContributorCampaignComponent implements OnInit {
  campaignData;
  checkoutCampaign: FormGroup;
  isFormSaving: boolean = false;
  Cards;
  loading = false;
  constructor(private fb: FormBuilder, private language: LanguageService, private modal: NzModalService, private router: Router, private campaignService: CampaignService, private route: ActivatedRoute, private translate: TranslateService) {

    this.checkoutCampaign = this.fb.group({
      campaignInfo: [''],
      // campaignBillingInfo: ['', [Validators.required]]
    });

  }

  ngOnInit(): void {
    const campaignId = this.route.snapshot.params['campaignId'];
    this.campaignService.getCampaignInfo(campaignId).subscribe((data) => {
      console.log(data);
      this.campaignData = data;
    }, error => {
      let $errorLbl = this.translate.instant("CampERROR");
      let $OkBtn = this.translate.instant("CampOK");
      this.modal.error({
        nzTitle: $errorLbl,
        nzContent: '<p>' + error ? error.message : error.message + '</p>',
        nzOnOk: () => $OkBtn
      });
    })
    this.displayPaymentMethod()
  }


  submitForm(values) {
    this.isFormSaving = true;
    const campaignId = this.route.snapshot.params['campaignId'];
    this.campaignService.checkoutCampaign(campaignId, { campaignInfo: values.campaignInfo }).subscribe((data: any) => {
      this.isFormSaving = false;
      let $paymentMessage = this.translate.instant("CampPaymentMessage");
      let $paymentHeading = this.translate.instant("CampPaymentSuccessful");
      let $OkBtn = this.translate.instant("CampGoToCampaign");
      let $transactionAmount = this.translate.instant("CampTransactionAmount");
      let $transactionId = this.translate.instant("CampTransactionId");
      this.modal.success({
        nzTitle: $paymentHeading,
        nzContent: `<p>${$paymentMessage}</p><br><p>${$transactionId} ${data.invoiceId}</p><br><p>${$transactionAmount} ${data.amount}</p>`,
        nzOnOk: () => {
          this.router.navigate(['app/campaign/campaign-manager']);
        }

      });

    }, (error) => {

      this.isFormSaving = false;
      let $errorLbl = this.translate.instant("CampERROR");
      let $OkBtn = this.translate.instant("CampOK");
      this.modal.error({
        nzTitle: $errorLbl,
        nzContent: '<p>' + error ? error.message : error.message + '</p>',
        nzOnOk: () => $OkBtn
      });
    })
  }
  displayPaymentMethod() {
    this.campaignService.getPaymentMethod().subscribe((data) => {
      this.Cards = data;
    })
  }
  updateBilling() {
    this.loading = true;
    this.campaignService.updateBilling().subscribe((response: any) => {
      this.loading = false;
      if (response.url) {
        window && window.open(response.url, '_self')
      } else {
        this.showError();
      }
    }, (errror) => {
      this.loading = false;
      this.showError();
    })


  }
  showError() {
    const msg = this.translate.instant("CampError");
    this.modal.warning({
      nzTitle: "<i>" + msg + "</i>",
    });
  }
  getLanguageByCode(code) {
    return this.language.getLanguageByCode(code).label;
  }
}


