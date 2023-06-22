import { Component, OnInit,ViewChild, Input } from '@angular/core';
import { GroupBillingComponent } from '../group-billing/group-billing.component';
import { GroupConstant } from 'src/app/shared/constants/group-constants';

import { ActivatedRoute } from '@angular/router';
import { GroupsService } from 'src/app/shared/services/group.service';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-select-package',
  templateUrl: './select-package.component.html',
  styleUrls: ['./select-package.component.scss']
})
export class SelectPackageComponent implements OnInit {
  @Input() groupId: string;
  @ViewChild(GroupBillingComponent) paymentDetails: GroupBillingComponent;
  groupCreatorId: string;
  groupCreator;
  isLoading: boolean = true;
  currentHostSubscription: any;
  selectedHostSubscription: any;
  isUpgradingPlan: boolean = false;
  packages = GroupConstant.YEARLY_PACKAGES;

  constructor(private activatedRoute: ActivatedRoute,
    private groupService: GroupsService,
    private message: NzMessageService,
    private modalService: NzModalService,
    public translate: TranslateService,
    public authService: AuthService
    ) { }

  ngOnInit(): void {
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;

      this.groupCreator = await this.authService.getLoggedInUser();
      this.groupCreatorId = this.groupCreator.id;
      if (!this.groupCreatorId)
      return;
      
      this.groupService.getGroupSubscription(this.groupCreatorId, this.groupId).subscribe((data) => {
        this.isLoading = false;
        this.currentHostSubscription = data[0];
        console.log(this.currentHostSubscription);
      }, err => {
        this.isLoading = false;
      });
  
  })
  }


  upgradeGroupSubscription(planSelected) {
    if (this.paymentDetails.paymentError) {
      this.message.create('error', 'Please select default payment method');
    } else {
      this.isUpgradingPlan = true;
      if (this.currentHostSubscription) {
        this.groupService.updateGroupPackageSubscription(this.groupCreator.id, this.currentHostSubscription.id, {
          external_id: planSelected.external_id,
          paymentMethodId: this.paymentDetails.defaultSelectedCard.id,
          package_type: planSelected.price
        }).subscribe((data) => {
          this.showSubscriptionResult('success');
          this.isUpgradingPlan = false;
        }, err => {
          this.showSubscriptionResult('error', err.message);
          this.isUpgradingPlan = false;
        });

      }
      else{
        this.groupService.createGroupSubscription(this.groupId, 
           {
          external_id: planSelected.external_id,
          paymentMethodId: this.paymentDetails.defaultSelectedCard.id,
          package_type: this.selectedHostSubscription.price
        }).subscribe((data) => {
          this.showSubscriptionResult('success');
          this.isUpgradingPlan = false;
        }, err => {
          this.showSubscriptionResult('error', err.message);
          this.isUpgradingPlan = false;
        });

      }
    }
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
  cancelSubscription() {
    return this.groupService.cancelGroupPackageSubscription(this.groupCreatorId, this.currentHostSubscription.id)
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





