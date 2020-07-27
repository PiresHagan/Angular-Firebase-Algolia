import { Component, OnInit } from '@angular/core';
import { CampaignService } from '../../shared/services/campaign.service';
import { NzModalService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-update-billing',
  templateUrl: './update-billing.component.html',
  styleUrls: ['./update-billing.component.css']
})
export class UpdateBillingComponent implements OnInit {
  loading = false;
  paymentError = true;
  Cards;
  constructor(private campaignService: CampaignService, private modelService: NzModalService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.displayPaymentMethod();
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
    this.modelService.warning({
      nzTitle: "<i>" + msg + "</i>",
    });
  }
  displayPaymentMethod() {
    this.campaignService.getPaymentMethod().subscribe((data) => {
      this.Cards = data;
      this.paymentError = false;
    }, (error) => {
      this.paymentError = true;
      this.Cards = [];

    })
  }

}
