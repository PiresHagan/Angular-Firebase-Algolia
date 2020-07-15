import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { SharedModule, createTranslateLoader } from 'src/app/shared/shared.module';

import { CampaignRoutingModule } from './campaign-routing.module';
import { CampaignManagerComponent } from './campaign-manager/campaign-manager.component';
import { CampaignSearchEngineComponent } from './campaign-search-engine/campaign-search-engine.component';
import { SponsoredPostComponent } from './sponsored-post/sponsored-post.component';
import { UpdateBillingComponent } from './update-billing/update-billing.component';
import { SearchEngineCampaignComponent } from './search-engine/search-engine-campaign/search-engine-campaign.component';
import { BuySearchEngineCampaignComponent } from './search-engine/buy-search-engine-campaign/buy-search-engine-campaign.component';
import { CheckoutSearchEngineCampaignComponent } from './search-engine/checkout-search-engine-campaign/checkout-search-engine-campaign.component';
import { CheckoutSuccessSearchEngineCampaignComponent } from './search-engine/checkout-success-search-engine-campaign/checkout-success-search-engine-campaign.component';
import { CheckoutTopContributorCampaignComponent } from './top-contributer/checkout-top-contributor-campaign/checkout-top-contributor-campaign.component';
import { BuyTopContributorCampaignComponent } from './top-contributer/buy-top-contributor-campaign/buy-top-contributor-campaign.component';
import { TopContributorCampaignComponent } from './top-contributer/top-contributor-campaign/top-contributor-campaign.component';
import { PostCampaignComponent } from './post/post-campaign/post-campaign.component';
import { BuyPostCampaignComponent } from './post/buy-post-campaign/buy-post-campaign.component';
import { CheckoutPostCampaignComponent } from './post/checkout-post-campaign/checkout-post-campaign.component';
import { CheckoutSuccessPostCampaignComponent } from './post/checkout-success-post-campaign/checkout-success-post-campaign.component';



@NgModule({
  declarations: [
    CampaignManagerComponent,
    CampaignSearchEngineComponent,
    SponsoredPostComponent,
    UpdateBillingComponent,
    SearchEngineCampaignComponent,
    BuySearchEngineCampaignComponent,
    BuyTopContributorCampaignComponent,
    BuyPostCampaignComponent,
    CheckoutSearchEngineCampaignComponent,
    CheckoutSuccessSearchEngineCampaignComponent,
    CheckoutTopContributorCampaignComponent,
    TopContributorCampaignComponent,
    PostCampaignComponent,
    CheckoutPostCampaignComponent,
    CheckoutSuccessPostCampaignComponent
  ],
  imports: [
    CommonModule,
    CampaignRoutingModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } })

  ]
})
export class CampaignModule { }

