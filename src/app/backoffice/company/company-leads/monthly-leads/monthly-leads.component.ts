import { Component, OnInit, Input } from '@angular/core';

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
      title: 'First Name',
      compare: (a: Lead, b: Lead) => a.first_name.localeCompare(b.first_name)
    },

    {
      title: 'Last Name',
      compare: (a: Lead, b: Lead) => a.last_name.localeCompare(b.last_name)
    },
    {
      title: 'Phone',
      compare: (a: Lead, b: Lead) => a.mobile_number.localeCompare(b.mobile_number)
    },
    {
      title: 'Email',
      compare: (a: Lead, b: Lead) => a.email.localeCompare(b.email)
    },
    {
      title: 'Created At'
    }
  ];
  dummyData = [
    {
      id: "qiuwq-12-1-21-2-112",
      first_name: "Rahul",
      last_name: "Rajabhoj",
      mobile_number: "8668509701",
      email: "rahulrajabhoj@gmail.com",
      created_at: new Date()
    }
  ]

  @Input() companyId: string;
  @Input() monthData;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
      this.displayData = this.dummyData;
    }, 1500);
  }

}
