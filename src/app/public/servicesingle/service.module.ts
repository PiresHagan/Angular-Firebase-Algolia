import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceComponent } from './service.component';

import { ServiceRoutingModule } from './service-routing.module';
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';
import { createTranslateLoader, SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { QuillModule } from 'ngx-quill';
import { SimilarServicesComponent } from './similar-services/similar-services.component';

@NgModule({
  declarations: [
    ServiceComponent,
    SimilarServicesComponent,
  ],
  imports: [
    ServiceRoutingModule,
    CloudinaryModule.forRoot({ Cloudinary }, { cloud_name: 'mytrendingstories' } as CloudinaryConfiguration),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } }),
    QuillModule.forRoot(),
  ]
})

export class ServiceModule { }
