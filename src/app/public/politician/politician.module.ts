import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PoliticianComponent } from './politician.component';
import { PoliticianRoutingModule } from './politician-routing.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { createTranslateLoader, SharedModule } from 'src/app/shared/shared.module';
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';
import { NgAisModule } from 'angular-instantsearch';
import { SinglePoliticianComponent } from './single-politician/single-politician.component';
import { SimilarPoliticiansComponent } from './single-politician/similar-politicians/similar-politicians.component';

@NgModule({
  declarations: [
    PoliticianComponent,
    SinglePoliticianComponent,
    SimilarPoliticiansComponent,
  ],
  imports: [
    CloudinaryModule.forRoot({ Cloudinary }, { cloud_name: 'mytrendingstories' } as CloudinaryConfiguration),
    CommonModule,
    PoliticianRoutingModule,
    SharedModule,
    NgAisModule.forRoot(),
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } }),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PoliticianModule { }
