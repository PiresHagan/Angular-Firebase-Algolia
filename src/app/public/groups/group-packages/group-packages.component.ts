import { Component, OnInit, ViewChild,EventEmitter,Output } from '@angular/core';
import { GroupBillingComponent } from '../group-billing/group-billing.component';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from 'src/app/shared/services/authentication.service';


import { GroupsService } from "src/app/shared/services/group.service";
import { GroupConstant } from "src/app/shared/constants/group-constants";
interface groupPackage {
  id: string,
  external_id: string,
  customer_type: string,
  price: number,
  package_type: string
}
interface groupSubscription {
  created_at: string,
  customer_id: string,
  external_id: string,
  id: string,
  limit: number,
  status: string,
  type: string
}
@Component({
  selector: 'app-group-packages',
  templateUrl: './group-packages.component.html',
  styleUrls: ['./group-packages.component.scss']
})
export class GroupPackagesComponent implements OnInit {
  @ViewChild(GroupBillingComponent) paymentDetails: GroupBillingComponent;
  @Output()  selectedPackage = new EventEmitter<string>();

  groupId: string;
  groupCreator;
  groupCreatorId;
  isLoading: boolean = true;
  currentGroupSubscription: groupSubscription;
  selectedGroupSubscription: groupPackage;
  isUpgradingPlan: boolean = false;
  packages = GroupConstant.YEARLY_PACKAGES;

  constructor(
    public activatedRoute: ActivatedRoute,
    private groupService: GroupsService,
    private message: NzMessageService,
    private modalService: NzModalService,
    public translate: TranslateService,
    public authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;
      this.groupCreator = await this.authService.getLoggedInUser();
      this.groupCreatorId = this.groupCreator.id;
      if (!this.groupCreatorId)
      return
  
  })
  }
   commafy( num ) {
    var str = num.toString().split('.');
    if (str[0].length >= 5) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    if (str[1] && str[1].length >= 5) {
        str[1] = str[1].replace(/(\d{3})/g, '$1 ');
    }
    return str.join('.');
}
  upgradeGroupSubscription(planSelected) {
    if (this.paymentDetails.paymentError) {
      this.message.create('error', 'Please select default payment method');
    } else {
      planSelected['paymentMethodId']=this.paymentDetails.defaultSelectedCard.id;
      this.selectedGroupSubscription=planSelected;
      this.currentGroupSubscription=planSelected;
      this.selectedPackage.emit(planSelected);
      this.showSubscriptionResult('success');
      this.isUpgradingPlan = false;
      
    
    }
  }

  cancelSubscription() {
    return this.groupService.cancelGroupPackageSubscription(this.groupId, this.currentGroupSubscription.id)
  }

  showSubscriptionResult(type, msg?) {
    if (type == 'error') {
      this.modalService.error({
        nzTitle: msg
      })
    } else if (type == 'success') {
      this.modalService.success({
        nzTitle: this.translate.instant("SubscriptionUpgradedSuccessfully!")
      })
    }
  }

}
