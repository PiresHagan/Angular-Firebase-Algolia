import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService } from '@ngx-translate/core';

import { CompanyLeadsPackageComponent } from '../company-leads-package/company-leads-package.component';

@Component({
  selector: 'app-company-subscription',
  templateUrl: './company-subscription.component.html',
  styleUrls: ['./company-subscription.component.scss']
})
export class CompanySubscriptionComponent implements OnInit {

  @ViewChild(CompanyLeadsPackageComponent) leadPackageComponent: CompanyLeadsPackageComponent;
  constructor(
    private modal: NzModalService,
    private message: NzMessageService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
  }

  cancelPlan() {
    this.translate.get("LeadSubscriptionCancelMsgConf").subscribe((text:string) => {
      let title = text;
      this.modal.confirm({
        nzTitle: title,
        nzOnOk: () =>
          new Promise((resolve, reject) => {
            this.leadPackageComponent.cancelSubscription().subscribe(() => {
              this.message.create('success', this.translate.instant("LeadSubscriptionCancelled"));
              resolve()
            }, error => {
              reject(error)
            })
          }).catch((err) => {
            this.message.create('error', err.message);
          })
      });
    });
  }

}
