import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [{
  path: 'sellproducts',
  loadChildren: () => import('./sellproducts/sellproducts.module').then(m => m.SellproductsModule)
},
{
  path: 'myorders',
  loadChildren: () => import('./myorders/myorders.module').then(m => m.MyordersModule)
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcommerceRoutingModule { }
