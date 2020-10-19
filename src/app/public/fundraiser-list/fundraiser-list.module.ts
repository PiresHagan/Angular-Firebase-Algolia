import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FundraiserListComponent } from './fundraiser-list.component';
import { FundraiserComponent } from './fundraiser/fundraiser.component';

import { FundraiserListRoutingModule } from './fundraiser-list-routing.module';
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';
import { createTranslateLoader } from 'src/app/shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxStripeModule } from 'ngx-stripe';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    FundraiserListComponent,
    FundraiserComponent
  ],
  imports: [
    CloudinaryModule.forRoot({ Cloudinary }, { cloud_name: 'mytrendingstories' } as CloudinaryConfiguration),
    CommonModule,
    FundraiserListRoutingModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    NgxStripeModule.forRoot(environment.stripePublishableKey),
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } })
  ]
})

export class FundraiserListModule { }
