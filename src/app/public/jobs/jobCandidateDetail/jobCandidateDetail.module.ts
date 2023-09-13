import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { jobCandidateDetailComponent } from './jobCandidateDetail.component';

import { createTranslateLoader } from 'src/app/shared/shared.module';
import { jobCandidateDetailRoutingModule } from './jobCandidateDetail-routing.module';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    jobCandidateDetailComponent
  ],
  imports: [
    CommonModule,
    jobCandidateDetailRoutingModule,
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } }),
  
  ]
})
export class jobCandidateDetailModule { }
