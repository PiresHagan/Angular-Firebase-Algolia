import { Component, OnInit } from '@angular/core';
import { TableService } from 'src/app/shared/services/table.service';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { CharityService } from '../../shared/services/charity.service';
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
  selector: 'app-charity-donation',
  templateUrl: './charity-donation.component.html',
  styleUrls: ['./charity-donation.component.css'],
  providers: [TableService]
})
export class CharityDonationComponent implements OnInit {
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
    private tableSvc: TableService, private charityService: CharityService, private activatedRoute: ActivatedRoute) { }


  ngOnInit(): void {
    this.loadData();
  }
  loadData() {

    let charityId = this.activatedRoute.snapshot.queryParams["charity"];
    if (!charityId) {
      this.isLoading = false;
      return;
    }

    this.charityService.getDonation(charityId, 5, null, this.lastVisibleFollower).subscribe((data) => {
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

