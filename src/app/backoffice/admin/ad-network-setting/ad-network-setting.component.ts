import { Component, OnInit } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';

import { Site } from 'src/app/shared/interfaces/ad-network-site.type';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { CommonBackofficeService } from '../../shared/services/common-backoffice.service';
import { BackofficeAdNetworkService } from '../../shared/services/backoffice-ad-network.service';
import { SiteConstant } from 'src/app/shared/constants/site-constant';

@Component({
  selector: 'app-ad-network-setting',
  templateUrl: './ad-network-setting.component.html',
  styleUrls: ['./ad-network-setting.component.scss']
})
export class AdNetworkSettingComponent implements OnInit {

  orderColumn = [
    {
      title: 'List of Sites'
    },
    {
      title: 'Publisher',
      align: 'center'
    },
    {
      title: 'Daily Traffic',
      align: 'center'
    },
    {
      title: 'Revenue',
      align: 'center'
    },
    {
      title: 'Status',
      align: 'center'
    },
    {
      title: 'Ad Units',
      align: 'center',
    },
    {
      title: 'Date Created',
      align: 'center'
    },
    {
      title: 'Action',
      align: 'center'
    }
  ];
  isLoading: boolean = true;
  loadingMore: boolean = false;
  displayData: Site[];
  lastVisibleSites;
  userDetails;
  approved = SiteConstant.APPROVED.title;
  rejected = SiteConstant.REJECTED.title;

  constructor(
    private authService: AuthService,
    private commonService: CommonBackofficeService,
    private adNetworkService: BackofficeAdNetworkService,
    private modal: NzModalService,
    public translate: TranslateService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    window.addEventListener('scroll', this.scrollEvent, true);
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;
      this.userDetails = await this.authService.getLoggedInUserDetails();
      if (this.userDetails) {
        this.commonService.getAdNetworkSites(25).subscribe((data) => {
          this.displayData = data.sitesList;
          this.lastVisibleSites = data.lastVisibleSites;
          this.isLoading = false;
        });
      }
    })
  }

  scrollEvent = (event: any): void => {
    if (event.target && event.target.documentElement) {
      const top = event.target.documentElement.scrollTop
      const height = event.target.documentElement.scrollHeight
      const offset = event.target.documentElement.offsetHeight
      if (top > height - offset - 1 - 100 && this.lastVisibleSites && !this.loadingMore) {
        this.loadingMore = true;
        this.commonService.getAdNetworkSites(null, 'next', this.lastVisibleSites).subscribe((data) => {
          this.loadingMore = false;
          this.displayData = [...this.displayData, ...data.sitesList];
          this.lastVisibleSites = data.lastVisibleSites;
        });
      }
    }
  }

  approveSite(site: Site) {
    this.changeStatus("SiteApproveConfirm", "SiteApproved", site, { status: SiteConstant.APPROVED});
  }

  rejectSite(site: Site) {
    this.changeStatus("SiteRejectConfirm", "SiteRejected", site, { status: SiteConstant.REJECTED});
  }

  showMessage(type: string, message: string) {
    this.message.create(type, message);
  }

  changeStatus(title, successMsg, site: Site, statusData) {
    this.translate.get(title, { url: site.url }).subscribe((text:string) => {
      const title = text;
      this.modal.confirm({
        nzTitle: title,
        nzOnOk: () =>
          new Promise((resolve, reject) => {
            this.adNetworkService.updateSite(site.publisher.id, site.id, statusData).then(() => {
              this.showMessage('success', this.translate.instant(successMsg));
              resolve();
            }).catch((err) => {
              this.showMessage('error', err.message);
              reject();
            })
          })
       });
    });
  }

}
