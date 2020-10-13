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
import { SearchEngineComponent } from './search-engine/search-engine.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxStripeModule } from 'ngx-stripe';

import { NgAisModule } from 'angular-instantsearch';
import { BuyComponent } from './buy/buy.component';
import { QuillModule } from 'ngx-quill';
import { createTranslateLoader, SharedModule } from '../shared/shared.module';
import { InfluencerComponent } from './influencer/influencer.component';
import { TodayComponent } from './today/today.component';
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';
import { CompanyComponent } from './company/company.component';
import { CompaniesComponent } from './companies/companies.component';
import { CharityComponent } from './charity/charity.component';
import { CharityListComponent } from './charity-list/charity-list.component';
import { environment } from 'src/environments/environment';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FundraiserComponent } from './fundraiser/fundraiser.component';
import { FundraiserListComponent } from './fundraiser-list/fundraiser-list.component';
import { CharityDonateFormComponent } from './charity/charity-donate-form/charity-donate-form.component';
import { CompanyLeadFormComponent } from './company/company-lead-form/company-lead-form.component';
import { CharityFollowersComponent } from './charity/charity-followers/charity-followers.component';
import { CompanyFollowersComponent } from './company/company-followers/company-followers.component';

@NgModule({
  declarations: [
    HomeComponent,
    CategoryComponent,
    ArticleComponent,
    Copywriter1Component,
    Copywriter2Component,
    SearchEngineComponent,
    BuyComponent,
    InfluencerComponent,
    TodayComponent,
    CompanyComponent,
    CompaniesComponent,
    CharityComponent,
    CharityListComponent,
    FundraiserComponent,
    FundraiserListComponent,
    CharityDonateFormComponent,
    CompanyLeadFormComponent,
    CharityFollowersComponent,
    CompanyFollowersComponent
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
    NgAisModule.forRoot(),
    SharedModule,
    NgxStripeModule.forRoot(environment.stripePublishableKey),
    NzModalModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PublicModule { }
