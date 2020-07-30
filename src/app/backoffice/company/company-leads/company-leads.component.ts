import { Component, OnInit } from '@angular/core';
import { TableService } from 'src/app/shared/services/table.service';
import { CompanyService } from '../../shared/services/company.service';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
interface DataItem {
  id: string
  first_name: string
  last_name: string
  mobile_number: string
  email: string,
}
@Component({
  selector: 'app-company-leads',
  templateUrl: './company-leads.component.html',
  styleUrls: ['./company-leads.component.css'],
  providers: [TableService]
})

export class CompanyLeadsComponent implements OnInit {
  isLoading: boolean = true;
  displayData = [];
  searchInput: string;
  lastVisibleFollower;
  loadingMoreFollowers;
  orderColumn = [
    {
      title: 'First Name',
      compare: (a: DataItem, b: DataItem) => a.first_name.localeCompare(b.first_name)
    },

    {
      title: 'Last Name',
      compare: (a: DataItem, b: DataItem) => a.last_name.localeCompare(b.last_name)
    },
    {
      title: 'Phone',
      compare: (a: DataItem, b: DataItem) => a.mobile_number.localeCompare(b.mobile_number)
    },
    {
      title: 'Email',
      compare: (a: DataItem, b: DataItem) => a.email.localeCompare(b.email)
    },
    {
      title: 'Created At'
    },
    {
      title: ''
    }
  ]
  originalData: DataItem[];

  constructor(
    private modalService: NzModalService,
    private translate: TranslateService,
    private tableSvc: TableService, private companyService: CompanyService, private activatedRoute: ActivatedRoute) { }


  ngOnInit(): void {
    this.loadData();
  }
  loadData() {

    let companyId = this.activatedRoute.snapshot.queryParams["company"];
    if (!companyId)
      return;
    this.companyService.getLeads(companyId, 5, null, this.lastVisibleFollower).subscribe((data) => {
      this.loadingMoreFollowers = false;
      this.isLoading = false;
      this.originalData = data.leads;
      this.displayData = data.leads;
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


}
