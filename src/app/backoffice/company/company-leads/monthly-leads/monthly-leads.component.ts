import { Component, OnInit, Input } from '@angular/core';
import { CompanyService } from 'src/app/backoffice/shared/services/company.service';

interface Lead {
  id: string
  first_name: string
  last_name: string
  mobile_number: string
  email: string,
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

  @Input() companyId: string;
  @Input() monthData: {
    id: string,
    lead_count: number,
    lead_over_limit: number
  };

  constructor(
    private companyService: CompanyService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.companyService.getLeadsOfMonth(this.companyId, this.monthData.id).subscribe((data) => {
      this.isLoading = false;
      this.displayData = data;
    }, err => {
      this.isLoading = false;
      this.displayData = [];
    });
  }

}
