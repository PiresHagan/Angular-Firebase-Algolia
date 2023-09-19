import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceComponent } from './service.component';
import { ServiceRoutingModule } from './service-routing.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { createTranslateLoader, SharedModule } from 'src/app/shared/shared.module';
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';
import { NgAisModule } from 'angular-instantsearch';
import { ServiceCatagoryComponent } from './service-catagory-list/service-list.component';

@NgModule({
  declarations: [
    ServiceComponent,
    ServiceCatagoryComponent
  ],
  imports: [
    CloudinaryModule.forRoot({ Cloudinary }, { cloud_name: 'mytrendingstories' } as CloudinaryConfiguration),
    CommonModule,
    ServiceRoutingModule,
    SharedModule,
    NgAisModule.forRoot(),
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } }),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ServiceModule { }
