import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodayComponent } from './today.component';

import { createTranslateLoader } from 'src/app/shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TodayRoutingModule } from './today-routing.module';

@NgModule({
  declarations: [
    TodayComponent
  ],
  imports: [
    CommonModule,
    TodayRoutingModule,
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } })
  ]
})

export class TodayModule { }
