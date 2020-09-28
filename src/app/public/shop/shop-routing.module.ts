import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
        path: ':sellerSlug',
        component: SellerHomeComponent
    },
    {
        path: ':sellerSlug/:productSlug',
        component: ProductDetailsComponent
    },
    {
        path: 'products/:productSlug',
        component: ProductDetailsComponent
    },
    {
        path: '',
        component: ProductCategoryComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
