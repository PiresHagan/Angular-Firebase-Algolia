import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';

import { CharityListComponent } from './charity-list.component';
import { CharityComponent } from './charity/charity.component';

import { CharityFollowerListComponent } from './charity/charity-follower-list/charity-follower-list.component';

import { CharityListRoutingModule } from './charity-list-routing.module';
import { createTranslateLoader, SharedModule } from 'src/app/shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxStripeModule } from 'ngx-stripe';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { NgAisModule } from 'angular-instantsearch';

@NgModule({
  declarations: [
    CharityListComponent,
    CharityComponent,
    CharityFollowerListComponent
  ],
  imports: [
    CloudinaryModule.forRoot({ Cloudinary }, { cloud_name: 'mytrendingstories' } as CloudinaryConfiguration),
    CommonModule,
    CharityListRoutingModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    SharedModule,
    NgAisModule.forRoot(),
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } })
  ]
})

export class CharityListModule { }
