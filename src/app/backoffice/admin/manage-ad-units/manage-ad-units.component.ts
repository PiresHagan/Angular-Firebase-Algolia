import { Component, OnInit } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';

import { AdUnit } from 'src/app/shared/interfaces/ad-network-ad-unit.type';
import { AdUnitConstant } from 'src/app/shared/constants/ad-unit-constant';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { BackofficeAdNetworkService } from '../../shared/services/backoffice-ad-network.service'
import { Site } from 'src/app/shared/interfaces/ad-network-site.type';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-ad-units',
  templateUrl: './manage-ad-units.component.html',
  styleUrls: ['./manage-ad-units.component.scss']
})
export class ManageAdUnitsComponent implements OnInit {
  adSizeOptions = [
    {
      label: "160 x 600 - (Wide Skyscraper)", 
      value: "160 x 600 - (Wide Skyscraper)"
    },
    {
      label: "300 x 50 - (Smartphone Banner)", 
      value: "300 x 50 - (Smartphone Banner)"
    },
    {
      label: "300 x 250 - (Medium Rectangle)", 
      value: "300 x 250 - (Medium Rectangle)"
    },
    {
      label: "300 x 600 - (Half Page Ad)", 
      value: "300 x 600 - (Half Page Ad)"
    },
    {
      label: "320 x 50 - (Smartphone Banner)", 
      value: "320 x 50 - (Smartphone Banner)"
    },{
      label: "728 x 90 - (Leaderboard)", 
      value: "728 x 90 - (Leaderboard)"
    },{
      label: "970 x 90 - (Super Leaderboard)", 
      value: "970 x 90 - (Super Leaderboard)"
    },{
      label: "970 x 250 - (Billboard)", 
      value: "970 x 250 - (Billboard)"
    }
  ];
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
    },
    {
      title: 'Date Created',
      align: 'center',
      compare: (a: AdUnit, b: AdUnit) => a.created_at.localeCompare(b.created_at)
    },
    {
      title: 'Actions',
      align: 'center'
    }
  ];
  isVisible = false;
  isOkLoading = false;
  isLoading: boolean = true;
  displayData = [];
  lastVisibleAdUnits;
  site: Site;
  editAdUnit: AdUnit | null = null;
  editAdUnitId: string | null = null;
  active = AdUnitConstant.ACTIVE.title;
  inactive = AdUnitConstant.INACTIVE.title;
  adUnitForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private adNetworkService: BackofficeAdNetworkService,
    private authService: AuthService,
    private modal: NzModalService,
    public translate: TranslateService,
    private message: NzMessageService,
    private location: Location,
    private route: ActivatedRoute
  ) { 
  }

  ngOnInit(): void {
    this.adUnitForm = this.fb.group({
      title: [null, [Validators.required]],
      size: [null, [Validators.required]],
      description: [null],
      code: [null]
    });

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
    this.adNetworkService.getSiteAdUnits(this.site.publisher.id, this.site.id, 5, this.lastVisibleAdUnits).subscribe((data) => {
      this.isLoading = false;
      this.displayData = data.siteAdUnits;
      this.lastVisibleAdUnits = data.lastVisible;
    }, (error) => {
      this.isLoading = false;
    });
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    for (const i in this.adUnitForm.controls) {
      this.adUnitForm.controls[i].markAsDirty();
      this.adUnitForm.controls[i].updateValueAndValidity();
    }
    
    if(this.adUnitForm.valid) {
      this.isOkLoading = true;
      let adUnitData = JSON.parse(JSON.stringify(this.adUnitForm.value));
      adUnitData['site_id'] = this.site.id;
      adUnitData['status'] = AdUnitConstant.INACTIVE;
      this.adNetworkService.addSiteAdUnit(this.site.publisher.id, adUnitData).then((result: any) => {
        this.handleCancel();
        this.showMessage('success', 'Ad unit added successfully');
      }).catch((err) => {
        this.isOkLoading = false;
        this.showMessage('error', err.message);
      })
    }
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isOkLoading = false;
    this.adUnitForm.reset();
  }

  activateAdUnit(adUnit: AdUnit) {
    this.changeAdUnitStatus("AdUnitActivateConfirm", "AdUnitActivated", adUnit, { status: AdUnitConstant.ACTIVE});
  }

  deactivateAdUnit(adUnit: AdUnit) {
    this.changeAdUnitStatus("AdUnitDeactivateConfirm", "AdUnitDeactivated", adUnit, { status: AdUnitConstant.INACTIVE});
  }

  showMessage(type: string, message: string) {
    this.message.create(type, message);
  }

  changeAdUnitStatus(title, successMsg, adUnit: AdUnit, statusData) {
    this.translate.get(title, { title: adUnit.title }).subscribe((text:string) => {
      const title = text;
      this.modal.confirm({
        nzTitle: title,
        nzOnOk: () =>
          new Promise((resolve, reject) => {
            this.adNetworkService.updateSiteAdUnit(this.site.publisher.id, adUnit.id, statusData).then(() => {
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

  startEdit(adUnit: AdUnit): void {
    this.editAdUnit = adUnit;
    this.editAdUnitId = adUnit.id;
  }

  stopEdit(): void {
    this.isLoading = true;
    this.adNetworkService.updateSiteAdUnit(this.site.publisher.id, this.editAdUnit.id, { code: this.editAdUnit.code }).then(() => {
      this.showMessage('success', this.translate.instant('AdUnitUpdated'));
      this.editAdUnit = null;
      this.editAdUnitId = null;
      this.isLoading = false;
    }).catch((err) => {
      this.showMessage('error', err.message);
      this.isLoading = false;
    })
  }

  deleteAdUnit(adUnit: AdUnit) {
    this.translate.get("AdUnitDeletMsgConf", { title: adUnit.title }).subscribe((text:string) => {
      let title = text;
      this.modal.confirm({
        nzTitle: title,
        nzOnOk: () =>
          new Promise((resolve, reject) => {
            this.adNetworkService.deleteSiteAdUnit(this.site.publisher.id, adUnit.id).subscribe(() => {
              this.showMessage('success', this.translate.instant("AdUnitDeleted"));
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

  goBack() {
    this.location.back();
  }

}
