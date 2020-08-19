import { Component, OnInit } from '@angular/core';
import { TableService } from 'src/app/shared/services/table.service';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { BackofficeFundraiserService } from '../../shared/services/backoffice-fundraiser.service';

interface DataItem {
  id: string
  first_name: string
  last_name: string
  mobile_number: string
  email: string,
  amount: number,
  message: string
}

@Component({
  selector: 'app-fundraiser-donation',
  templateUrl: './fundraiser-donation.component.html',
  styleUrls: ['./fundraiser-donation.component.scss'],
  providers: [TableService]
})
export class FundraiserDonationComponent implements OnInit {

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
      title: 'Phone'
    },
    {
      title: 'Email',
      compare: (a: DataItem, b: DataItem) => a.email.localeCompare(b.email)
    },
    {
      title: 'Amount',
      compare: (a: DataItem, b: DataItem) => a.amount - b.amount
    },
    {
      title: 'Message'
    },
    {
      title: 'Created At'
    }
  ]
  originalData: DataItem[];

  constructor(
    private modalService: NzModalService,
    private translate: TranslateService,
    private tableSvc: TableService, 
    private fundraiserService: BackofficeFundraiserService, 
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    let fundraiserId = this.activatedRoute.snapshot.queryParams["fundraiser"];
    if (!fundraiserId) {
      this.isLoading = false;
      return;
    }

    this.fundraiserService.getDonation(fundraiserId, 5, null, this.lastVisibleFollower).subscribe((data) => {
      this.loadingMoreFollowers = false;
      this.isLoading = false;
      this.originalData = data.donations;
      this.displayData = data.donations;
      this.lastVisibleFollower = data.lastVisible;
    }, (error) => {
      this.isLoading = false;
    });

  }

  search() {
    const data = this.originalData
    this.displayData = this.tableSvc.search(this.searchInput, data);
  }

}
