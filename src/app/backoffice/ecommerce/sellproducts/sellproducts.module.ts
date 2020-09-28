
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellproductsRoutingModule } from './sellproducts-routing.module';
import { StoresComponent } from './stores/stores.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductReviewComponent } from './product-review/product-review.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { CreateStoreComponent } from './create-store/create-store.component';
import { SharedModule, createTranslateLoader } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TableService } from 'src/app/shared/services/table.service';
import { OrderListComponent } from './order-list/order-list.component';
import { InvoiceComponent } from './invoice/invoice.component';


@NgModule({
  declarations: [StoresComponent, ProductListComponent, ProductReviewComponent, CreateProductComponent, CreateStoreComponent, OrderListComponent, InvoiceComponent],
  imports: [
    CommonModule,
    SellproductsRoutingModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,

    QuillModule,
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } })
  ],
  providers: [TableService]
})
export class SellproductsModule { }
