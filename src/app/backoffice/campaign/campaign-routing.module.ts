import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CampaignManagerComponent } from './campaign-manager/campaign-manager.component';
import { CampaignSearchEngineComponent } from './campaign-search-engine/campaign-search-engine.component';
import { SponsoredContributorComponent } from './sponsored-contributor/sponsored-contributor.component';
import { SponsoredPostComponent } from './sponsored-post/sponsored-post.component';
import { UpdateBillingComponent } from './update-billing/update-billing.component';


const routes: Routes = [
  {
    path: 'campaign-manager',
    component: CampaignManagerComponent,
    data: {
      title: "Campaigns",
    }
  },
  {
    path: 'search-engine',
    component: CampaignSearchEngineComponent,
    data: {
      title: "Search Engine",
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
    path: 'sponsored-post',
    component: SponsoredPostComponent,
    data: {
      title: "Sponsored Post",
    }
  },
  {
    path: 'update-billing',
    component: UpdateBillingComponent,
    data: {
      title: "CampBilling",
    }
  }


];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampaignRoutingModule { }
