import { Component, OnInit } from '@angular/core';
import { TableService } from 'src/app/shared/services/table.service';
import { CompanyService } from '../../shared/services/company.service';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
interface DataItem {
  id: string
  month: string
  total_leads_count: string
  leads_count_over_limit: string
  plan_info: string,
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
  displayData = [];
  searchInput: string;
  lastVisibleFollower;
  loadingMoreFollowers;
  orderColumn = [
    {
      title: 'Month & Year',
      align: 'center',
      compare: (a: DataItem, b: DataItem) => a.month.localeCompare(b.month)
    },
    {
      title: 'Total Lead Count',
      align: 'center',
      compare: (a: DataItem, b: DataItem) => a.total_leads_count.localeCompare(b.total_leads_count)
    },
    {
      title: 'Leads Count Exceeding Package',
      align: 'center',
      compare: (a: DataItem, b: DataItem) => a.leads_count_over_limit.localeCompare(b.leads_count_over_limit)
    },
    {
      title: 'Actions',
      align: 'center',
    }
  ]
  originalData: DataItem[];
  dummyData = [
    {
      id: "1213232",
      month: "2020-12-12",
      total_leads_count: `${Math.random()*10000}`,
      leads_count_over_limit: `${Math.random()*100}`,
      plan_id: "2312312"
    },
    {
      id: "1213232",
      month: "2020-11-12",
      total_leads_count: `${Math.random()*10000}`,
      leads_count_over_limit: `${Math.random()*100}`,
      plan_id: "2312312"
    },
    {
      id: "1213232",
      month: "2020-10-12",
      total_leads_count: `${Math.random()*10000}`,
      leads_count_over_limit: `${Math.random()*100}`,
      plan_id: "2312312"
    },
    {
      id: "1213232",
      month: "2020-09-12",
      total_leads_count: `${Math.random()*10000}`,
      leads_count_over_limit: `${Math.random()*100}`,
      plan_id: "2312312"
    },
    {
      id: "1213232",
      month: "2020-08-12",
      total_leads_count: `${Math.random()*10000}`,
      leads_count_over_limit: `${Math.random()*100}`,
      plan_id: "2312312"
    },
    {
      id: "1213232",
      month: "2020-07-12",
      total_leads_count: `${Math.random()*10000}`,
      leads_count_over_limit: `${Math.random()*100}`,
      plan_id: "2312312"
    },
    {
      id: "1213232",
      month: "2020-06-12",
      total_leads_count: `${Math.random()*10000}`,
      leads_count_over_limit: `${Math.random()*100}`,
      plan_id: "2312312"
    },
    {
      id: "1213232",
      month: "2020-05-12",
      total_leads_count: `${Math.random()*10000}`,
      leads_count_over_limit: `${Math.random()*100}`,
      plan_id: "2312312"
    },
    {
      id: "1213232",
      month: "2020-04-12",
      total_leads_count: `${Math.random()*10000}`,
      leads_count_over_limit: `${Math.random()*100}`,
      plan_id: "2312312"
    },
    {
      id: "1213232",
      month: "2020-03-12",
      total_leads_count: `${Math.random()*10000}`,
      leads_count_over_limit: `${Math.random()*100}`,
      plan_id: "2312312"
    },
    {
      id: "1213232",
      month: "2020-02-12",
      total_leads_count: `${Math.random()*10000}`,
      leads_count_over_limit: `${Math.random()*100}`,
      plan_id: "2312312"
    },
    {
      id: "1213232",
      month: "2020-01-12",
      total_leads_count: `${Math.random()*10000}`,
      leads_count_over_limit: `${Math.random()*100}`,
      plan_id: "2312312"
    }
  ];
  selectedMonthData;

  constructor(
    private modalService: NzModalService,
    private translate: TranslateService,
    private tableSvc: TableService, private companyService: CompanyService, private activatedRoute: ActivatedRoute) { }


  ngOnInit(): void {
    this.loadData();
  }
  loadData() {

    this.companyId = this.activatedRoute.snapshot.queryParams["company"];
    if (!this.companyId)
      return;
    this.companyService.getLeads(this.companyId, 5, null, this.lastVisibleFollower).subscribe((data) => {
      this.loadingMoreFollowers = false;
      this.isLoading = false;
      this.originalData = data.leads;
      this.displayData = [...data.leads, ...this.dummyData];
      this.lastVisibleFollower = data.lastVisible;
    });

  }
  search() {
    const data = this.originalData
    this.displayData = this.tableSvc.search(this.searchInput, data);
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

  viewLeadsByMonth(month) {
    this.selectedMonthData = JSON.stringify(month);
  }

  goBack() {
    this.selectedMonthData = null;
  }


}
