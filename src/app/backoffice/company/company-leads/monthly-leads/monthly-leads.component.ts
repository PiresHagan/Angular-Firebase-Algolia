import { Component, OnInit, Input } from '@angular/core';
import { CompanyService } from 'src/app/backoffice/shared/services/company.service';
import { ExportService } from 'src/app/backoffice/shared/services/export.service';

interface Lead {
  id: string
  first_name: string
  last_name: string
  mobile_number: string
  email: string,
  created_at: string
}

interface ExportLeadData {
  FirstName: string,
  LastName: string,
  MobileNumber: string,
  Email: string,
  ContactedOn: string
}

@Component({
  selector: 'app-monthly-leads',
  templateUrl: './monthly-leads.component.html',
  styleUrls: ['./monthly-leads.component.scss']
})

export class MonthlyLeadsComponent implements OnInit {

  isLoading: boolean = true;
  displayData;
  originalData: Lead[];
  searchInput: string;
  lastVisibleFollower;
  loadingMoreFollowers;
  orderColumn = [
    {
      title: 'No.'
    },
    {
      title: 'First Name'
    },
    {
      title: 'Last Name'
    },
    {
      title: 'Phone'
    },
    {
      title: 'Email'
    },
    {
      title: 'Created At'
    }
  ];
  exportData: Array<ExportLeadData> = [];
  exportDataReady: boolean = false;

  @Input() companyId: string;
  @Input() monthData: {
    id: string,
    lead_count: number,
    lead_over_limit: number
  };

  constructor(
    private companyService: CompanyService,
    private exportService: ExportService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.companyService.getLeadsOfMonth(this.companyId, this.monthData.id).subscribe((data) => {
      this.isLoading = false;
      this.displayData = data;
      for(let lead of this.displayData) {
        const obj: Lead = lead;
        this.exportData.push({
          FirstName: obj.first_name,
          LastName: obj.last_name,
          MobileNumber: obj.mobile_number,
          Email: obj.email,
          ContactedOn: new Date(obj.created_at).toString()
        });
      }
      this.exportDataReady = true;
    }, err => {
      this.isLoading = false;
      this.displayData = [];
    });
  }
  
  export() {
    this.exportService.exportExcel(this.exportData, `${this.monthData.id}-leads`);
  }

}
