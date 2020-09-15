import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';

import { CompanyService } from '../../shared/services/company.service';

interface Card {
  exp_month: number,
  exp_year: number,
  id: string,
  isDefault: boolean,
  last4: string,
  vendor: string
}

@Component({
  selector: 'app-company-billing',
  templateUrl: './company-billing.component.html',
  styleUrls: ['./company-billing.component.scss']
})
export class CompanyBillingComponent implements OnInit {

  companyId: string;
  loading = false;
  paymentError = true;
  cards: Card[];
  defaultSelectedCard: Card;
  constructor(
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService, 
    private modelService: NzModalService, 
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.companyId = this.activatedRoute.snapshot.queryParams["company"];
    this.displayPaymentMethod();
  }

  updateBilling() {
    this.loading = true;
    this.companyService.updateBilling(this.companyId).subscribe((response: any) => {
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
    this.companyService.getPaymentMethod(this.companyId).subscribe((data: Card[]) => {
      this.cards = data;
      for(let card of this.cards){
        if(card.isDefault) {
          this.defaultSelectedCard = card;
          this.paymentError = false;
          break;
        }
      }
    }, (error) => {
      this.paymentError = true;
      this.cards = [];
    })
  }

}
