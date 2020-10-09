import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ProductCheckoutComponent } from './product-checkout/product-checkout.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { SellerHomeComponent } from './seller-home/seller-home.component';

import { ShopHomeComponent } from './shop-home/shop-home.component';

const routes: Routes = [
    {
        path: '',
        component: ShopHomeComponent
    },
    {
        path: 'cart',
        component: CartComponent
    },
    {
        path: 'checkout',
        component: ProductCheckoutComponent
    },
    {
        path: ':sellerSlug',
        component: SellerHomeComponent
    },
    {
        path: 'category/:categorySlug',
        component: ProductCategoryComponent
    },
    {
        path: 'products/:productSlug',
        component: ProductDetailsComponent
    },
    {
        path: ':sellerSlug/:productSlug',
        component: ProductDetailsComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
