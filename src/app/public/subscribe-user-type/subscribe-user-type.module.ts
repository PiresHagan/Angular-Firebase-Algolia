import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule, createTranslateLoader } from 'src/app/shared/shared.module';
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

import { SubscribeUserTypeRoutingModule } from './subscribe-user-type-routing.module';
import { SubscribeUserTypeComponent } from './subscribe-user-type.component';

@NgModule({
  declarations: [SubscribeUserTypeComponent],
  imports: [
    CloudinaryModule.forRoot({ Cloudinary }, { cloud_name: 'mytrendingstories' } as CloudinaryConfiguration),
    CommonModule,
    SubscribeUserTypeRoutingModule,
    SharedModule,
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } }),
  
  ]
})
export class SubscribeUserTypeModule { }
