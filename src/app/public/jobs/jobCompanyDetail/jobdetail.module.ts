import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobDetailComponent } from './jobdetail.component';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

import { createTranslateLoader } from 'src/app/shared/shared.module';
import { JobDetailRoutingModule } from './jobdetail-routing.module';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    JobDetailComponent
  ],
  imports: [
    CommonModule,
    NzSkeletonModule,
    JobDetailRoutingModule,
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } }),
  
  ]
})
export class JobDetailModule { }
