import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { HomeComponent } from './home/home.component';
import { CategoryComponent } from './category/category.component';
import { ArticleComponent } from './article/article.component';
import { ProfileComponent } from './profile/profile.component';
import { Copywriter1Component } from './copywriter1/copywriter1.component';
import { Copywriter2Component } from './copywriter2/copywriter2.component';
import { ContactComponent } from './contact/contact.component';
import { TermsComponent } from './terms/terms.component';
import { FaqComponent } from './faq/faq.component';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
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
import { PrivacyComponent } from './privacy/privacy.component';
import { PrivacyEnComponent } from './privacy/privacy-en/privacy-en.component';
import { VideoComponent } from './video/video.component';
import { AudioComponent } from './audio/audio.component';
import { PrivacyFrComponent } from './privacy/privacy-fr/privacy-fr.component';
import { PrivacyEsComponent } from './privacy/privacy-es/privacy-es.component';
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';
import { CompanyComponent } from './company/company.component';
import { CompaniesComponent } from './companies/companies.component';
import { CharityComponent } from './charity/charity.component';
import { CharityListComponent } from './charity-list/charity-list.component';
import { environment } from 'src/environments/environment';
@NgModule({
  declarations: [
    HomeComponent,
    CategoryComponent,
    ArticleComponent,
    ProfileComponent,
    Copywriter1Component,
    Copywriter2Component,
    ContactComponent,
    TermsComponent,
    FaqComponent,
    SearchEngineComponent,
    BuyComponent,
    InfluencerComponent,
    TodayComponent,
    PrivacyComponent,
    PrivacyEnComponent,
    VideoComponent,
    AudioComponent,
    PrivacyFrComponent,
    PrivacyEsComponent,
    CompanyComponent,
    CompaniesComponent,
    CharityComponent,
    CharityListComponent
  ],
  imports: [
    CloudinaryModule.forRoot({Cloudinary}, { cloud_name: 'mytrendingstories' } as CloudinaryConfiguration),
    CommonModule,
    PublicRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    QuillModule.forRoot(),
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } }),
    NzCollapseModule,
    NgAisModule.forRoot(),
    SharedModule,
    NgxStripeModule.forRoot(environment.stripePublishableKey),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PublicModule { }
