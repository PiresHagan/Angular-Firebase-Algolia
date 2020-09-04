import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AuthService } from 'src/app/shared/services/authentication.service';
import { BackofficeAdNetworkService } from '../../shared/services/backoffice-ad-network.service';
import { Site } from 'src/app/shared/interfaces/ad-network-site.type';
import { NzModalService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { SiteConstant } from 'src/app/shared/constants/site-constant';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.scss']
})

export class SitesComponent implements OnInit {
 
  isVisible = false;
  isOkLoading = false;
  addSiteForm: FormGroup;
  publisher;
  dailyTrafficOptions = [
    {
      label: "< 1k page view",
      value: "< 1k page view"
    },
    {
      label: "1k - 10k page views",
      value: "1k - 10k page views"
    },
    {
      label: "10k - 100k page views",
      value: "10k - 100k page views"
    },
    {
      label: "100k - 1M page views",
      value: "100k - 1M page views"
    },
    {
      label: "> 1M page views",
      value: "> 1M page views"
    }
  ];
  adRevenueOptions = [
    {
      label: "< $100/month", 
      value: "< $100/month"
    },
    {
      label: "$100 to $1,000/month", 
      value: "$100 to $1,000/month"
    },
    {
      label: "$1,000 to $10,000/month", 
      value: "$1,000 to $10,000/month"
    },
    {
      label: "$10,000 to $50,000/month", 
      value: "$10,000 to $50,000/month"
    },
    {
      label: "$50,000 to $100,000/month", 
      value: "$50,000 to $100,000/month"
    },
    {
      label: "> $100,000/month", 
      value: "> $100,000/month"
    }
  ];

  orderColumn = [
    {
      title: 'List of Sites',
      compare: (a: Site, b: Site) => a.url.localeCompare(b.url)
    },
    {
      title: 'Daily Traffic',
      align: 'center',
      compare: (a: Site, b: Site) => a.daily_traffic.localeCompare(b.daily_traffic)
    },
    {
      title: 'Revenue',
      align: 'center',
      compare: (a: Site, b: Site) => a.revenue.localeCompare(b.revenue)
    },
    {
      title: 'Status',
      align: 'center',
      compare: (a: Site, b: Site) => a.status.title.localeCompare(b.status.title)
    },
    {
      title: 'Ad Units',
      align: 'center',
    },
    {
      title: 'Action',
      align: 'center'
    }
  ];
  isLoading: boolean = true;
  displayData = [];
  lastVisibleSites;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private adNetworkService: BackofficeAdNetworkService,
    private authService: AuthService,
    private message: NzMessageService,
    private modal: NzModalService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.addSiteForm = this.fb.group({
      url: ['', [Validators.required]],
      daily_traffic: [null, [Validators.required]],
      revenue: [null]
    });

    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;

      this.publisher = await this.authService.getLoggedInUserDetails();

      this.loadData();
    })
  }

  loadData() {
    this.adNetworkService.getSitesByPublisher(this.publisher.id, 5, this.lastVisibleSites).subscribe((data) => {
      this.isLoading = false;
      this.displayData = data.sites;
      this.lastVisibleSites = data.lastVisible;
    }, (error) => {
      this.isLoading = false;
    });
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    for (const i in this.addSiteForm.controls) {
      this.addSiteForm.controls[i].markAsDirty();
      this.addSiteForm.controls[i].updateValueAndValidity();
    }

    if(this.addSiteForm.valid) {
      this.isOkLoading = true;
      let siteData = JSON.parse(JSON.stringify(this.addSiteForm.value));
      siteData.url = `https://${siteData.url}`;
      siteData['publisher'] = {};
      siteData.publisher['id'] = this.publisher.id;
      siteData.publisher['type'] = this.publisher.type;
      siteData.publisher['name'] = this.publisher.fullname;
      siteData['status'] = SiteConstant.IN_PROCESS;
      this.adNetworkService.addNewSite(this.publisher.id, siteData).then((result: any) => {
        this.handleCancel();
        this.showMessage('success', 'Site added successfully');
      }).catch((err) => {
        this.isOkLoading = false;
        this.showMessage('error', err.message);
      })
    }
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isOkLoading = false;
    this.addSiteForm.reset();
  }

  showMessage(type: string, message: string) {
    this.message.create(type, message);
  }

  deleteSite(site: Site) {
    this.translate.get("SiteDeletMsgConf", { url: site.url }).subscribe((text:string) => {
      let title = text;
      this.modal.confirm({
        nzTitle: title,
        nzOnOk: () =>
          new Promise((resolve, reject) => {
            this.adNetworkService.deleteSite(this.publisher.id, site.id).subscribe(() => {
              this.showMessage('success', this.translate.instant("SiteDeleted"));
              resolve()
            }, error => {
              reject(error)
            })
  
          }).catch((err) => {
            this.showMessage('error', err.message);
          })
      });
    });
  }

}
