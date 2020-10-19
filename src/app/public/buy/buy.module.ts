import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuyComponent } from './buy.component';

import { BuyRoutingModule } from './buy-routing.module';
import { createTranslateLoader } from 'src/app/shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    BuyComponent
  ],
  imports: [
    BuyRoutingModule,
    CommonModule,
    NzModalModule,
    NgZorroAntdModule,
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } }),
  ]
})

export class BuyModule { }
