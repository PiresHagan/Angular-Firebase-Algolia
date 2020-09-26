import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopHomeComponent } from './shop-home/shop-home.component';

const routes: Routes = [
  {
    path: '',
    component: ShopHomeComponent,
    data: {
      title: 'Shop Home ',
      headerDisplay: "none"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
