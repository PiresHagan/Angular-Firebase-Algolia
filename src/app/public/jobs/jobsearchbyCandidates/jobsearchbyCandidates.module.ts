import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { jobsearchbyCandidatesComponent } from './jobsearchbyCandidates.component';

import { createTranslateLoader } from 'src/app/shared/shared.module';
import { jobsearchbyCandidatesRoutingModule } from './jobsearchbyCandidates-routing.module';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgAisModule } from 'angular-instantsearch';


@NgModule({
  declarations: [
    jobsearchbyCandidatesComponent
  ],
  imports: [
    CommonModule,
    jobsearchbyCandidatesRoutingModule,
    FormsModule,
    NgAisModule.forRoot(),
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } }),
  
  ]
})
export class jobsearchbyCandidatesModule { }
