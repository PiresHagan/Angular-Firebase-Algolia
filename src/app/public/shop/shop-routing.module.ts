import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
