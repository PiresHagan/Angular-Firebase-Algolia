import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyOrderListComponent } from './my-order-list/my-order-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';


const routes: Routes = [{
  path: '',
  children: [
    {
      path: 'my-order-list',
      component: MyOrderListComponent,
      data: {
        title: "MyOrders"
      }
    },
    {
      path: 'order-details',
      component: OrderDetailsComponent,
      data: {
        title: "MyOrderDetails"
      }
    }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyordersRoutingModule { }
