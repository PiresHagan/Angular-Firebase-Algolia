import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { CompanyService } from '../../shared/services/company.service';
import { CompanyBillingComponent } from '../company-billing/company-billing.component';

interface LeadPackage {
  id: string,
  external_id: string,
  name: string,
  price: number,
  limit: number
}

interface LeadSubscription { 
  created_at: string,
  customer_id: string,
  external_id: string,
  id: string,
  limit: number,
  package_id: string,
  status: string,
  type: string
}

interface PublicProfilePackage {
  id: string,
  external_id: string,
  name: string,
  price: number,
}

interface PublicProfileSubscription { 
  created_at: string,
  customer_id: string,
  external_id: string,
  id: string,
  package_id: string,
  status: string,
  type: string
}

@Component({
  selector: 'app-company-leads-package',
  templateUrl: './company-leads-package.component.html',
  styleUrls: ['./company-leads-package.component.scss']
})

export class CompanyLeadsPackageComponent implements OnInit {

  @ViewChild(CompanyBillingComponent) paymentDetails: CompanyBillingComponent;

  leadPackages: LeadPackage[] = [];
  publicProfilePackages: PublicProfilePackage[] = [];
  companyId: string;
  isLoading: boolean = true;
  currentLeadSubscription: LeadSubscription;
  currentPublicProfileSubscription: PublicProfileSubscription; 
  selectedLeadSubscription: LeadPackage;
  selectedPublicProfileSubscription: PublicProfilePackage;
  isUpgradingPlan: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService,
    private message: NzMessageService,
    private modalService: NzModalService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.companyId = this.activatedRoute.snapshot.queryParams["company"];

    if (!this.companyId)
      return;

    this.loadData();

    this.companyService.getCompanyLeadSubscription(this.companyId).subscribe((data) => {
      this.isLoading = false;
      this.currentLeadSubscription = data[0];
    }, err => {
      this.isLoading = false;
    });

    this.companyService.getCompanyPublicProfileSubscription(this.companyId).subscribe((data) => {
      this.isLoading = false;
      this.currentPublicProfileSubscription = data[0];
    }, err => {
      this.isLoading = false;
    });

  }

  loadData() {
    this.companyService.getLeadsPackage().subscribe((data: LeadPackage[])=> {
      this.leadPackages = data;
    }, err => {
      // console.error(err);
    })

    this.companyService.getCompanyPublicProfilePackages().subscribe((data: PublicProfilePackage[])=> {
      this.publicProfilePackages = data;
    }, err => {
      // console.error(err);
    });

  }  

  upgradeSubscription(planSelected) {
    if(this.paymentDetails.paymentError) {
      this.message.create('error', 'Please select default payment method');
    } else {
      this.isUpgradingPlan = true;
      this.selectedLeadSubscription = planSelected;
      if(this.currentLeadSubscription) {
        this.companyService.updateLeadPackageSubscription(this.companyId, this.currentLeadSubscription.id, { 
          packageId: this.selectedLeadSubscription.id, 
          paymentMethodId: this.paymentDetails.defaultSelectedCard.id
        }).subscribe( (data) => {
          this.showSubscriptionResult('success');
          this.isUpgradingPlan = false;
        }, err => {
          this.showSubscriptionResult('error', err.message);
          this.isUpgradingPlan = false;
        }); 
      } else {
        this.companyService.createLeadPackageSubscription(this.companyId, { 
          packageId: this.selectedLeadSubscription.id, 
          paymentMethodId: this.paymentDetails.defaultSelectedCard.id
        }).subscribe( (data) => {
          this.showSubscriptionResult('success');
          this.isUpgradingPlan = false;
        }, err => {
          this.showSubscriptionResult('error', err.message);
          this.isUpgradingPlan = false;
        });
      }
    }
  }

  cancelSubscription() {
    return this.companyService.cancelLeadPackageSubscription(this.companyId, this.currentLeadSubscription.id)
  }

  upgradePublicProfileSubscription(planSelected) {
    if(this.paymentDetails.paymentError) {
      this.message.create('error', 'Please select default payment method');
    } else {
      this.isUpgradingPlan = true;
      this.selectedPublicProfileSubscription = planSelected;
      this.companyService.createPublicProfilePackageSubscription(this.companyId, { 
        packageId: this.selectedPublicProfileSubscription.id, 
        paymentMethodId: this.paymentDetails.defaultSelectedCard.id
      }).subscribe( (data) => {
        this.showSubscriptionResult('success');
        this.isUpgradingPlan = false;
      }, err => {
        this.showSubscriptionResult('error', err.message);
        this.isUpgradingPlan = false;
      });
    }
  }

  cancelPublicProfileSubscription() {
    return this.companyService.cancelLeadPackageSubscription(this.companyId, this.currentPublicProfileSubscription.id)
  }

  showSubscriptionResult(type, msg?) {
    if (type == 'error') {
      this.modalService.error({
        nzTitle: msg
      })
    } else if (type == 'success') {
      this.modalService.success({
        nzTitle: "Subscription upgraded successfully!"
      })
    }
  }

}
