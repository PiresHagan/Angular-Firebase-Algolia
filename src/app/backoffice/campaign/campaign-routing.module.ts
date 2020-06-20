import { NgModule } from '@angular/core';
import { SponsoredPostComponent } from './sponsored-post/sponsored-post.component';
import { Routes, RouterModule } from '@angular/router';
import { CampaignManagerComponent } from './campaign-manager/campaign-manager.component';
import { SponsoredContributorComponent } from './sponsored-contributor/sponsored-contributor.component';
import { CampaignSearchEngineComponent } from './campaign-search-engine/campaign-search-engine.component';


const routes: Routes = [
    {
      path: 'campaign-manager',
      component: CampaignManagerComponent,
      data: {
        title: "Campaigns",
      }
    },
    {
      path: 'sponsored-post',
      component: SponsoredPostComponent,
      data: {
        title: "Sponsored post",
      }
    },
    {
      path: 'sponsored-contributor',
      component: SponsoredContributorComponent,
      data: {
        title: "Sponsored Contributor",
      }
    },
    {
      path: 'search-engine',
      component: CampaignSearchEngineComponent,
      data: {
        title: "Search Engine",
      }
    },
];
 
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampaignRoutingModule { }
