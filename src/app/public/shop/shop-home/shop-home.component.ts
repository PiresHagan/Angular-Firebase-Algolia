import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/interfaces/ecommerce/product';
import { Store } from 'src/app/shared/interfaces/ecommerce/store';
import { ProductService } from 'src/app/shared/services/shop/product.service';
import { StoreService } from 'src/app/shared/services/shop/store.service';

@Component({
  selector: 'app-shop-home',
  templateUrl: './shop-home.component.html',
  styleUrls: ['./shop-home.component.scss']
})
export class ShopHomeComponent implements OnInit {

  topProducts: Array<Product>;
  todaysDealProducts: Array<Product>;
  fashionProducts: Array<Product>;
  stores: Array<Store>;
  dummyProducts = [
    {
        id: "122121212",
        title: "royalex watch for men",
        slug: "reree",
        summary: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        price: {
            salePrice: 80,
            unitPrice: 100
        }
    },
    {
      id: "122121212",
      title: "royalex watch for men",
      slug: "reree",
      summary: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      price: {
          salePrice: 80,
          unitPrice: 100
      }
    },
    {
      id: "122121212",
      title: "royalex watch for men",
      slug: "reree",
      summary: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      price: {
          salePrice: 80,
          unitPrice: 100
      }
    },
    {
      id: "122121212",
      title: "royalex watch for men",
      slug: "reree",
      summary: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      price: {
          salePrice: 80,
          unitPrice: 100
      }
    },
    {
      id: "122121212",
      title: "royalex watch for men",
      slug: "reree",
      summary: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      price: {
          salePrice: 80,
          unitPrice: 100
      }
    }
  ];
  dummyStores = [
    {
      id: "1212-121221",
      name: "Royalex Watch Center",
      slug: "12-121-2121"
    },{

      id: "1212-121221",
      name: "Royalex Watch Center",
      slug: "12-121-2121"
    },
    {
      id: "1212-121221",
      name: "Royalex Watch Center",
      slug: "12-121-2121"
    },
    {
      id: "1212-121221",
      name: "Royalex Watch Center",
      slug: "12-121-2121"
    }
  ];

  constructor(
    private productService: ProductService,
    private storeService: StoreService
  ) { }

  ngOnInit(): void {

    this.productService.getTopProducts().subscribe((data: any) => {
      this.topProducts = [...data, ...this.dummyProducts];
    })

    this.productService.getProductForTodaysDeal().subscribe((data: any) => {
      this.todaysDealProducts = [...data, ...this.dummyProducts];
    })

    this.productService.getFashionForEveryoneProducts().subscribe((data: any) => {
      this.fashionProducts = [...data, ...this.dummyProducts];
    })

    this.storeService.getAllStores().subscribe((data: any) => {
      this.stores = [...data, ...this.dummyStores];
    })
    
  }

}
