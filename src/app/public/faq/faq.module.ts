import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaqComponent } from './faq.component';

import { createTranslateLoader } from 'src/app/shared/shared.module';
import { FaqRoutingModule } from './faq-routing.module';
import { HttpClient } from '@angular/common/http';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    FaqComponent
  ],
  imports: [
    CommonModule,
    FaqRoutingModule,
    NzCollapseModule,
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } }),
  ]
})
export class FaqModule { }
