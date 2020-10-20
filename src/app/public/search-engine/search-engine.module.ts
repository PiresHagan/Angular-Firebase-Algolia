import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';

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
    CloudinaryModule.forRoot({ Cloudinary }, { cloud_name: 'mytrendingstories' } as CloudinaryConfiguration),
    CommonModule,
    NgAisModule.forRoot(),
    SearchEngineRoutingModule,
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } }),
  ]
})

export class SearchEngineModule { }
