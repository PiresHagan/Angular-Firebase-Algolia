import { Component, OnInit } from '@angular/core';
import { TableService } from 'src/app/shared/services/table.service';
import { CompanyService } from '../../shared/services/company.service';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { CompanyConstant } from 'src/app/shared/constants/company-constant';

interface Month {
  id: string,
  lead_count: number
}

@Component({
  selector: 'app-company-leads',
  templateUrl: './company-leads.component.html',
  styleUrls: ['./company-leads.component.scss'],
  providers: [TableService]
})

export class CompanyLeadsComponent implements OnInit {
  isLoading: boolean = true;
  companyId: string;
  displayData;
  searchInput: string;
  orderColumn = [
    {
      title: 'Month & Year'
    },
    {
      title: 'Total Lead Count',
      align: 'center'
    },
    {
      title: 'Lead Count Exceeding Package',
      align: 'center'
    },
    {
      title: 'Actions',
      align: 'center',
    }
  ];
  selectedMonthData;
  activeLeadSubscription;
  defaultLeadLimit = CompanyConstant.FREE_LEAD_COUNT;

  constructor(
    private modalService: NzModalService,
    private translate: TranslateService,
    private companyService: CompanyService, 
    private activatedRoute: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.loadData();
  }

  refresh() {
    this.isLoading = true;
    this.loadData();
  }

  loadData() {
    this.companyId = this.activatedRoute.snapshot.queryParams["company"];
    if (!this.companyId)
      return;

    this.companyService.getCompanySubscription(this.companyId).subscribe((data) => {
      this.activeLeadSubscription = data[0];
    });

    this.companyService.getLeadsMonthly(this.companyId).subscribe((data) => {
      this.isLoading = false;
      this.displayData = data;
    }, err => {
      this.isLoading = false;
    });
  }

  deleteLead(companyId: string) {
    this.modalService.confirm({
      nzTitle: "<i>" + this.translate.instant("DeleteConfMessage") + "</i>",
      nzOnOk: () => {
        this.companyService.deletCompany(companyId).subscribe(() => {
          this.modalService.success({
            nzTitle: "<i>" + this.translate.instant("DeleteSuccess") + "</i>",
          });
        }, (error) => {
          this.modalService.error({
            nzTitle: this.translate.instant("SomethingWrong"),
          });
        })
      },
    });

  }

  viewLeadsByMonth(month: Month) {
    let data: Month = JSON.parse(JSON.stringify(month));
    data['lead_over_limit'] = this.getExceedingLeadsCount(data.lead_count);
    this.selectedMonthData = data;
  }

  goBack() {
    this.selectedMonthData = null;
  }

  getExceedingLeadsCount(lead_count: number) {
    let lead_limit = CompanyConstant.FREE_LEAD_COUNT;

    if(this.activeLeadSubscription) {
      lead_limit = this.activeLeadSubscription.limit;
    } 

    const lead_diff = lead_count - lead_limit;
    if(lead_diff > 0)
      return lead_diff;
    else 
      return 0;
  }


}
