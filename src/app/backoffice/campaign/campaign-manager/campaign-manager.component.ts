
import { Component, OnInit } from '@angular/core';
import { CampaignService } from '../../shared/services/campaign.service';
import { SEARCHENGINECAMPAIGN, TOPCONTRIBUTORCAMPAIGN, TOPPOSTCAMPAIGN } from 'src/app/shared/constants/campaign-constants';
import { NzModalService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';

interface DataItem {
  date: string
  id: string
  price: number
  type: string,
  status: string
}


@Component({
  selector: 'app-campaign-manager',
  templateUrl: './campaign-manager.component.html',
  styleUrls: ['./campaign-manager.component.scss']
})
export class CampaignManagerComponent implements OnInit {

  selectedCategory: string;
  selectedStatus: string;
  searchInput: any;
  displayData = [];
  SEARCHENGINECAMPAIGN = SEARCHENGINECAMPAIGN;
  TOPCONTRIBUTORCAMPAIGN = TOPCONTRIBUTORCAMPAIGN;
  TOPPOSTCAMPAIGN = TOPPOSTCAMPAIGN;
  isLoading: boolean = true;



  orderColumn = [
    {
      title: 'ID',
      compare: (a: DataItem, b: DataItem) => a.id.localeCompare(b.id)
    },
    {
      title: 'Campaign',
      compare: (a: DataItem, b: DataItem) => a.type.localeCompare(b.type)
    },

    {
      title: 'CampPrice',
      compare: (a: DataItem, b: DataItem) => a.price - b.price,
    },
    {
      title: 'CampDate'
    },

    {
      title: 'CampStatus',
      compare: (a: DataItem, b: DataItem) => a.status.localeCompare(b.status)
    },
    {
      title: ''
    }
  ]
  originalData: DataItem[];
  constructor(private campaign: CampaignService, private modal: NzModalService, private translate: TranslateService) {


  }
  ngOnInit() {
    this.loadData();
  }

  statusChange(value: string): void {
    const data = this.originalData
    value !== 'All' ? this.displayData = data.filter(elm => elm.status === value) : this.displayData = data
  }
  stopCampaign(id) {
    this.showConfirm(id);
  }
  showConfirm(id): void {
    this.modal.confirm({
      nzTitle: this.translate.instant("CampaignStop"),
      nzContent: this.translate.instant("CampaignStopMsg"),
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.campaign.terminate(id).subscribe(() => {
            this.modal.success({
              nzTitle: this.translate.instant("CampaignStopped")
            })
            this.loadData();
            resolve()
          }, error => {
            reject()
          })

        }).catch(() => {
          this.modal.error({
            nzTitle: this.translate.instant("CampaignStoppedErr")
          })
        })
    });
  }
  loadData() {
    this.isLoading = true;
    this.campaign.getCampaign().subscribe((data: DataItem[]) => {
      this.isLoading = false;
      this.displayData = data;
      this.originalData = data;
    }, error => {
      this.modal.error({
        nzTitle: this.translate.instant("CampaignStoppedErr")
      })
    });
  }
  deleteCampaign(id) {
    this.modal.confirm({
      nzTitle: this.translate.instant("CampDeletMsgConf"),
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.campaign.deleteCampaign(id).subscribe(() => {
            this.modal.success({
              nzTitle: this.translate.instant("CampDeleted")
            })
            this.loadData();
            resolve()
          }, error => {
            reject()
          })

        }).catch(() => {
          this.modal.error({
            nzTitle: this.translate.instant("CampaignStoppedErr")
          })
        })
    });

  }
}    