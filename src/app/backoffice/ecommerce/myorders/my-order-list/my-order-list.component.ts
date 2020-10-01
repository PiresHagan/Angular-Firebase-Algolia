import { Component } from '@angular/core';
import { TableService } from '../../../shared/services/table.service';
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { StoreSetting } from 'src/app/backoffice/shared/services/store-setting.service';

interface DataItem {
  id: number;
  created_at: string;
  totalPrice: number;
}

@Component({
  templateUrl: './my-order-list.component.html',
  styleUrls: ['./my-order-list.component.css']
})

export class MyOrderListComponent {

  allChecked: boolean = false;
  indeterminate: boolean = false;
  displayData = [];
  searchInput: string;
  isDataLoading: boolean = true;

  orderColumn = [
    {
      title: 'ID',
      compare: (a: DataItem, b: DataItem) => a.id - b.id,
    },
    {
      title: 'Date',
      compare: (a: DataItem, b: DataItem) => a.created_at.localeCompare(b.created_at)
    },
    {
      title: 'Amount',
      compare: (a: DataItem, b: DataItem) => a.totalPrice - b.totalPrice,
    },
    {
      title: 'Status',

    },
    {
      title: 'Preview'
    }
  ]

  ordersList = [

  ]

  constructor(private tableSvc: TableService, private storeService: StoreSetting) {
    this.displayData = this.ordersList;
    this.storeService.getCustomerOrder().subscribe((data: DataItem[]) => {
      this.ordersList = data;
      this.displayData = data;
      this.isDataLoading = false;
      console.log(data);
    })
  }

  search() {
    const data = this.ordersList
    this.displayData = this.tableSvc.search(this.searchInput, data)
  }

}    