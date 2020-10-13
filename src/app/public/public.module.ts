import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { HomeComponent } from './home/home.component';
import { CategoryComponent } from './category/category.component';
import { ArticleComponent } from './article/article.component';
import { Copywriter1Component } from './copywriter1/copywriter1.component';
import { Copywriter2Component } from './copywriter2/copywriter2.component';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxStripeModule } from 'ngx-stripe';

import { BuyComponent } from './buy/buy.component';
import { QuillModule } from 'ngx-quill';
import { createTranslateLoader, SharedModule } from '../shared/shared.module';
import { InfluencerComponent } from './influencer/influencer.component';
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';
import { environment } from 'src/environments/environment';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FundraiserComponent } from './fundraiser/fundraiser.component';
import { FundraiserListComponent } from './fundraiser-list/fundraiser-list.component';

@NgModule({
  declarations: [
    HomeComponent,
    CategoryComponent,
    ArticleComponent,
    Copywriter1Component,
    Copywriter2Component,
    BuyComponent,
    InfluencerComponent,
    FundraiserComponent,
    FundraiserListComponent
  ],
  imports: [
    CloudinaryModule.forRoot({ Cloudinary }, { cloud_name: 'mytrendingstories' } as CloudinaryConfiguration),
    CommonModule,
    PublicRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    QuillModule.forRoot(),
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } }),
    SharedModule,
    NgxStripeModule.forRoot(environment.stripePublishableKey),
    NzModalModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PublicModule { }
