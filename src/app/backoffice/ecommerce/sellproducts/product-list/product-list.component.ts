
import { Component, OnInit } from '@angular/core';
import { TableService } from '../../../shared/services/table.service';
import { StoreSetting } from 'src/app/backoffice/shared/services/store-setting.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/shared/services/user.service';
import { Store } from 'src/app/shared/interfaces/ecommerce/store';
import { NzModalService } from 'ng-zorro-antd';

interface DataItem {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  status: string;
}

@Component({
  templateUrl: './product-list.component.html'
})

export class ProductListComponent implements OnInit {

  selectedCategory: string;
  selectedStatus: string;
  searchInput: any;
  displayData = [];
  currentUser;
  storeDetails;


  orderColumn = [
    {
      title: 'ID',
      compare: (a: DataItem, b: DataItem) => a.id - b.id,
    },
    {
      title: 'ProductName',
      compare: (a: DataItem, b: DataItem) => a.name.localeCompare(b.name)
    },
    {
      title: 'SalePrice',
    },
    {
      title: 'Quantity',
      compare: (a: DataItem, b: DataItem) => a.quantity - b.quantity,
    },
    {
      title: 'Status',
      compare: (a: DataItem, b: DataItem) => a.name.localeCompare(b.name)
    },
    {
      title: ''
    }
  ]

  productsList = [

  ]

  constructor(private tableSvc: TableService, private storeservice: StoreSetting, public translate: TranslateService, private modalService: NzModalService,
    private userService: UserService) {
    this.displayData = this.productsList
  }

  ngOnInit(): void {
    this.userService.getCurrentUser().then((user) => {
      this.currentUser = user;




      this.storeservice.getStoreById(user.uid).subscribe((storeDetails: Store) => {
        if (storeDetails && storeDetails[0])
          this.storeDetails = storeDetails[0];
        this.storeservice.getProducts(this.storeDetails.id).subscribe((productsList) => {

          this.displayData = productsList;
          this.productsList = productsList;
        })

      })
    })


  }


  search(): void {
    const data = this.productsList
    this.displayData = this.tableSvc.search(this.searchInput, data)
  }

  categoryChange(value: string): void {
    const data = this.productsList
    value !== 'All' ? this.displayData = data.filter(elm => elm.category === value) : this.displayData = data
  }

  statusChange(value: string): void {
    const data = this.productsList
    value !== 'All' ? this.displayData = data.filter(elm => elm.status === value) : this.displayData = data
  }

  deleteProduct(id: string) {
    let productMessageConf = this.translate.instant("ProductDeletMsgConf");
    let productMessageSucc = this.translate.instant("ProductDeleted");
    this.modalService.confirm({
      nzTitle: "<i>" + productMessageConf + "</i>",
      nzOnOk: () => {
        this.storeservice.deleteProduct(this.storeDetails.id, id).subscribe(() => {
          this.modalService.success({
            nzTitle: "<i>" + productMessageSucc + "</i>",
          });

        }, error => {

          this.modalService.error({
            nzTitle: "<i>" + this.translate.instant("SomethingWrong") + "</i>",
          });
        }
        )
      }

    });




  }


}  