import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackofficeRoutingModule } from './backoffice-routing.module';
import { SharedModule } from '../shared/shared.module';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { EcommerceModule } from './ecommerce/ecommerce.module';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { BusinessFundingComponent } from './business-funding/business-funding.component';
import { ECommerceFundingComponent } from './e-commerce-funding/e-commerce-funding.component';
import { MerchantProcessingComponent } from './merchant-processing/merchant-processing.component';
import { BitcoinStoreComponent } from './bitcoin-store/bitcoin-store.component';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}




@NgModule({
  declarations: [NewsletterComponent, BusinessFundingComponent, ECommerceFundingComponent, MerchantProcessingComponent, BitcoinStoreComponent],
  imports: [
    CommonModule,
    SharedModule,
    BackofficeRoutingModule,
    EcommerceModule,
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } })

  ],
  exports: []
})
export class BackofficeModule { }
