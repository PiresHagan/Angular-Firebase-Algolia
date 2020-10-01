import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader, SharedModule } from 'src/app/shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { NgxStripeModule } from 'ngx-stripe';

import { ShopRoutingModule } from './shop-routing.module';
import { ShopHomeComponent } from './shop-home/shop-home.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { SellerHomeComponent } from './seller-home/seller-home.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ProductCheckoutComponent } from './product-checkout/product-checkout.component';
import { CartComponent } from './cart/cart.component';
import { CartCalculatorComponent } from './cart/cart-calculator/cart-calculator.component';
import { environment } from 'src/environments/environment';
import { ShopLoginComponent } from './shop-login/shop-login.component';

@NgModule({
  declarations: [
    ShopHomeComponent, 
    ProductDetailsComponent, 
    SellerHomeComponent, 
    ProductCategoryComponent, 
    CartComponent, 
    CartCalculatorComponent,
    ProductCheckoutComponent,
    ShopLoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxStripeModule.forRoot(environment.stripePublishableKey),
    ReactiveFormsModule,
    ShopRoutingModule,
    SharedModule,
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } }),
  ]
})
export class ShopModule { }
