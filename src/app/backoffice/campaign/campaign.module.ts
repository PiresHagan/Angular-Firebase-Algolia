import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignRoutingModule } from './campaign-routing.module';
import { SponsoredPostComponent } from './sponsored-post/sponsored-post.component';
import { CampaignManagerComponent } from './campaign-manager/campaign-manager.component';
import { SponsoredContributorComponent } from './sponsored-contributor/sponsored-contributor.component';
import { CampaignSearchEngineComponent } from './campaign-search-engine/campaign-search-engine.component';



@NgModule({
  declarations: [SponsoredPostComponent, CampaignManagerComponent, SponsoredContributorComponent, CampaignSearchEngineComponent],
  imports: [
    CommonModule,
    CampaignRoutingModule,
    
  ]
})
export class CampaignModule { }
