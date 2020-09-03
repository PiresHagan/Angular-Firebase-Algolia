import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackofficeAdNetworkService } from '../../shared/services/backoffice-ad-network.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.scss']
})

export class SitesComponent implements OnInit {
 
  isVisible = false;
  isOkLoading = false;
  addSiteForm: FormGroup;
  loggedInUser;
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
  ]

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private adNetworkService: BackofficeAdNetworkService,
    private authService: AuthService,
    private message: NzMessageService
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
      this.loggedInUser = await this.authService.getLoggedInUserDetails();
    })
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
      siteData['publisherType'] = this.loggedInUser.type;
      this.adNetworkService.addNewSite(this.loggedInUser.id, siteData).then((result: any) => {
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
}
