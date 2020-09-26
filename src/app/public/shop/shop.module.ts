import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopRoutingModule } from './shop-routing.module';
import { ShopHomeComponent } from './shop-home/shop-home.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { SellerHomeComponent } from './seller-home/seller-home.component';


@NgModule({
  declarations: [ShopHomeComponent, ProductDetailsComponent, SellerHomeComponent],
  imports: [
    CommonModule,
    ShopRoutingModule
  ]
})
export class ShopModule { }
