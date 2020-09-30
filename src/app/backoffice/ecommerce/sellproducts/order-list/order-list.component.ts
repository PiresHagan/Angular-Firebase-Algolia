import { Component } from '@angular/core';
import { TableService } from '../../../shared/services/table.service';
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { StoreSetting } from 'src/app/backoffice/shared/services/store-setting.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Store } from 'src/app/shared/interfaces/ecommerce/store';

interface DataItem {
  id: number;
  name: string;
  date: string;
  amount: number;
  status: string;
}

@Component({
  templateUrl: './order-list.component.html'
})

export class OrderListComponent {

  allChecked: boolean = false;
  indeterminate: boolean = false;
  displayData = [];
  searchInput: string
  currentUser;
  storeDetails: Store;
  isDataLoading = true;
  orderColumn = [
    {
      title: 'ID',
      compare: (a: DataItem, b: DataItem) => a.id - b.id,
    },
    {
      title: 'Customer',
      compare: (a: DataItem, b: DataItem) => a.name.localeCompare(b.name)
    },
    {
      title: 'Date',
      compare: (a: DataItem, b: DataItem) => a.name.localeCompare(b.name)
    },
    {
      title: 'Amount',
      compare: (a: DataItem, b: DataItem) => a.amount - b.amount,
    },
    {
      title: 'Status',
      compare: (a: DataItem, b: DataItem) => a.name.localeCompare(b.name)
    },
    {
      title: ''
    }
  ]
  ordersList = [];


  constructor(private tableSvc: TableService, private storeService: StoreSetting, private userService: UserService) {
    this.displayData = this.ordersList
    this.displayData = this.ordersList;
    this.userService.getCurrentUser().then((user) => {
      debugger;
      this.currentUser = user;

      this.storeService.getStoreById(user.uid).subscribe((storeDetails: Store) => {
        this.storeDetails = storeDetails ? storeDetails[0] : null;;;
        this.storeService.getStoreOrders(this.storeDetails.id).subscribe((data: DataItem[]) => {
          this.ordersList = data;
          this.displayData = data;
          this.isDataLoading = false;
          console.log(data);
        })
      })
    })


  }

  search() {
    const data = this.ordersList
    this.displayData = this.tableSvc.search(this.searchInput, data)
  }

}    