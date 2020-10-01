import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyordersRoutingModule } from './myorders-routing.module';
import { MyOrderListComponent } from './my-order-list/my-order-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { SharedModule, createTranslateLoader } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';


@NgModule({
  declarations: [MyOrderListComponent, OrderDetailsComponent],
  imports: [
    CommonModule,
    MyordersRoutingModule,
    CommonModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,

    QuillModule,
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } })
  ]
})
export class MyordersModule { }
