import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignRoutingModule } from './campaign-routing.module';
import { CampaignManagerComponent } from './campaign-manager/campaign-manager.component';
import { CampaignSearchEngineComponent } from './campaign-search-engine/campaign-search-engine.component';
import { SponsoredContributorComponent } from './sponsored-contributor/sponsored-contributor.component';
import { SponsoredPostComponent } from './sponsored-post/sponsored-post.component';
import { UpdateBillingComponent } from './update-billing/update-billing.component';
import { SharedModule, createTranslateLoader } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';



@NgModule({
  declarations: [CampaignManagerComponent, CampaignSearchEngineComponent, SponsoredContributorComponent, SponsoredPostComponent, UpdateBillingComponent],
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

