import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { jobsearchbyCategoriesComponent } from './jobsearchbyCategories.component';

import { createTranslateLoader } from 'src/app/shared/shared.module';
import { ContactRoutingModule } from './jobsearchbyCategories-routing.module';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgAisModule } from 'angular-instantsearch';
import { RouterModule, Routes } from '@angular/router';


@NgModule({
  declarations: [
    jobsearchbyCategoriesComponent
  ],
  imports: [
    CommonModule,
    ContactRoutingModule,
    FormsModule,
    NgAisModule.forRoot(),
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } }),
  
  ]
})
export class jobsearchbyCategoriesModule { }
