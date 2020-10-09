import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/shared/interfaces/ecommerce/category';
import { Product } from 'src/app/shared/interfaces/ecommerce/product';
import { Store } from 'src/app/shared/interfaces/ecommerce/store';
import { CartService } from 'src/app/shared/services/shop/cart.service';
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
  categories: Array<ProductCategory>;

  constructor(
    public cartService: CartService,
    private productService: ProductService,
    private storeService: StoreService
  ) { }

  ngOnInit(): void {

    this.productService.getTopProducts().subscribe((data: any) => {
      this.topProducts = data;
    })

    this.productService.getProductForTodaysDeal().subscribe((data: any) => {
      this.todaysDealProducts = data;
    })

    this.productService.getFashionForEveryoneProducts().subscribe((data: any) => {
      this.fashionProducts = data;
    })

    this.storeService.getAllStores().subscribe((data: any) => {
      this.stores = data;
    })

    this.productService.getAllProductCategories().subscribe((data: any) => {
      this.categories = data;
    })
    
  }
 
}
