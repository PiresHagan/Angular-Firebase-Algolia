import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';

import { AdUnit } from 'src/app/shared/interfaces/ad-network-ad-unit.type';
import { Site } from 'src/app/shared/interfaces/ad-network-site.type';
import { AdUnitConstant } from 'src/app/shared/constants/ad-unit-constant';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { BackofficeAdNetworkService } from '../../shared/services/backoffice-ad-network.service';
@Component({
  selector: 'app-ad-units',
  templateUrl: './ad-units.component.html',
  styleUrls: ['./ad-units.component.scss']
})
export class AdUnitsComponent implements OnInit {
  
  isVisible = false;
  orderColumn = [
    {
      title: 'Size',
      compare: (a: AdUnit, b: AdUnit) => a.size.localeCompare(b.size)
    },
    {
      title: 'Title',
      compare: (a: AdUnit, b: AdUnit) => a.title.localeCompare(b.title)
    },
    {
      title: 'Description',
      compare: (a: AdUnit, b: AdUnit) => a.description.localeCompare(b.description)
    },
    {
      title: 'Code',
      align: 'center',
    },
    {
      title: 'Status',
      align: 'center',
      compare: (a: AdUnit, b: AdUnit) => a.status.title.localeCompare(b.status.title)
    }
  ];
  isLoading: boolean = true;
  displayData = [];
  lastVisibleAdUnits;
  site: Site;
  active = AdUnitConstant.ACTIVE.title;
  inactive = AdUnitConstant.INACTIVE.title;
  copyAdUnitCode = "";

  constructor(
    private route: ActivatedRoute,
    public translate: TranslateService,
    private message: NzMessageService,
    private authService: AuthService,
    private location: Location,
    private adNetworkService: BackofficeAdNetworkService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {

      const siteId = params.get('siteId');
      this.authService.getAuthState().subscribe(async (user) => {
        if (!user)
          return;

        this.adNetworkService.getSiteById(siteId).subscribe(data => {
          this.site = data[0];
          this.loadData();
        }, err => {
          console.error(err);
        });
      })
    });
  }

  loadData() {
    this.adNetworkService.getSiteAdUnitsForPublisher(this.site.publisher.id, this.site.id, 5, this.lastVisibleAdUnits).subscribe((data) => {
      this.isLoading = false;
      this.displayData = data.siteAdUnits;
      this.lastVisibleAdUnits = data.lastVisible;
    }, (error) => {
      this.isLoading = false;
    });
  }

  showMessage(type: string, message: string) {
    this.message.create(type, message);
  }

  goBack() {
    this.location.back();
  }

  showModal(adUnit: AdUnit): void {
    this.copyAdUnitCode = adUnit.code;
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
    this.copyAdUnitCode = "";
  }

  handleCancel(): void {
    this.isVisible = false;
    this.copyAdUnitCode = "";
  }
}
