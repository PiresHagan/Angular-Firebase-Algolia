import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService } from '@ngx-translate/core';
import { VideoConferencePackageComponent } from '../video-conference-package/video-conference-package.component';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {
  @ViewChild(VideoConferencePackageComponent) videoConferencePackageComponent: VideoConferencePackageComponent;

  constructor(private modal: NzModalService,
    private message: NzMessageService,
    public translate: TranslateService) { }

  ngOnInit(): void {
  }
  cancelPlan() {
    this.translate.get("HostSubscriptionCancelMsgConf").subscribe((text:string) => {
      let title = text;
      this.modal.confirm({
        nzTitle: title,
        nzOnOk: () =>
          new Promise((resolve, reject) => {
            this.videoConferencePackageComponent.cancelSubscription().subscribe(() => {
              this.message.create('success', this.translate.instant("HostSubscriptionCancelled"));
              resolve(true);
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
