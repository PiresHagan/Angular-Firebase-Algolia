import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ShopRoutingModule } from './shop-routing.module';
import { ShopHomeComponent } from './shop-home/shop-home.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { SellerHomeComponent } from './seller-home/seller-home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ProductCheckoutComponent } from './product-checkout/product-checkout.component';
import { CartComponent } from './cart/cart.component';
import { CartCalculatorComponent } from './cart/cart-calculator/cart-calculator.component';

@NgModule({
  declarations: [
    ShopHomeComponent, 
    ProductDetailsComponent, 
    SellerHomeComponent, 
    ProductCategoryComponent, 
    CartComponent, 
    CartCalculatorComponent,
    ProductCheckoutComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ShopRoutingModule,
    SharedModule
  ]
})
export class ShopModule { }
