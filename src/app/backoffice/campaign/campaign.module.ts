import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignRoutingModule } from './campaign-routing.module';
import { CampaignManagerComponent } from './campaign-manager/campaign-manager.component';
import { CampaignSearchEngineComponent } from './campaign-search-engine/campaign-search-engine.component';
import { SponsoredContributorComponent } from './sponsored-contributor/sponsored-contributor.component';
import { SponsoredPostComponent } from './sponsored-post/sponsored-post.component';



@NgModule({
  declarations: [CampaignManagerComponent, CampaignSearchEngineComponent, SponsoredContributorComponent, SponsoredPostComponent],
  imports: [
    CommonModule,
    CampaignRoutingModule
  ]
})
export class CampaignModule { }
