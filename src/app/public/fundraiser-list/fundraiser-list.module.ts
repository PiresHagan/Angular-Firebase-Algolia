import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FundraiserListComponent } from './fundraiser-list.component';
import { FundraiserComponent } from './fundraiser/fundraiser.component';
import { FundraiserAuthorComponent } from './fundraiser/fundraiser-author/fundraiser-author.component';

import { FundraiserListRoutingModule } from './fundraiser-list-routing.module';
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';
import { createTranslateLoader, SharedModule } from 'src/app/shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxStripeModule } from 'ngx-stripe';
import { NgAisModule } from 'angular-instantsearch';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { FundraiserFollowerListComponent } from './fundraiser/fundraiser-follower-list/fundraiser-follower-list.component';

@NgModule({
  declarations: [
    FundraiserListComponent,
    FundraiserComponent,
    FundraiserAuthorComponent,
    FundraiserFollowerListComponent
  ],
  imports: [
    CloudinaryModule.forRoot({ Cloudinary }, { cloud_name: 'mytrendingstories' } as CloudinaryConfiguration),
    CommonModule,
    FundraiserListRoutingModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    NgAisModule.forRoot(),
    NgxStripeModule.forRoot(environment.stripePublishableKey),
    SharedModule,
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } })
  ]
})

export class FundraiserListModule { }
