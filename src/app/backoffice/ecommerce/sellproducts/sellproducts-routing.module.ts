import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateStoreComponent } from './create-store/create-store.component';
import { ProductListComponent } from './product-list/product-list.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { StoresComponent } from './stores/stores.component';
import { OrderListComponent } from './order-list/order-list.component';
import { InvoiceComponent } from './invoice/invoice.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'store-settings',
        component: StoresComponent,
        data: {
          title: "StoreSettings"
        }
      },
      {
        path: 'product-list',
        component: ProductListComponent,
        data: {
          title: 'ProductList'
        }
      },
      {
        path: 'create-product',
        component: CreateProductComponent,
        data: {
          title: 'CreateProduct'
        }
      },
      {
        path: 'order-list',
        component: OrderListComponent,
        data: {
          title: "OrderList"
        }
      },
      {
        path: 'invoice',
        component: InvoiceComponent,
        data: {
          title: "Invoice"
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellproductsRoutingModule { }
