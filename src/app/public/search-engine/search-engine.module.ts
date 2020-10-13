import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchEngineComponent } from './search-engine.component';

import { createTranslateLoader } from 'src/app/shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { NgAisModule } from 'angular-instantsearch';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SearchEngineRoutingModule } from './search-engine-routing.module';

@NgModule({
  declarations: [
    SearchEngineComponent
  ],
  imports: [
    CommonModule,
    NgAisModule.forRoot(),
    SearchEngineRoutingModule,
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } }),
  ]
})

export class SearchEngineModule { }
