import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CampaignManagerComponent } from './campaign-manager/campaign-manager.component';
import { UpdateBillingComponent } from './update-billing/update-billing.component';
import { BuyTopContributorCampaignComponent } from './top-contributer/buy-top-contributor-campaign/buy-top-contributor-campaign.component';
import { CheckoutTopContributorCampaignComponent } from './top-contributer/checkout-top-contributor-campaign/checkout-top-contributor-campaign.component';
import { BuySearchEngineCampaignComponent } from './search-engine/buy-search-engine-campaign/buy-search-engine-campaign.component';
import { CheckoutSearchEngineCampaignComponent } from './search-engine/checkout-search-engine-campaign/checkout-search-engine-campaign.component';
import { BuyPostCampaignComponent } from './post/buy-post-campaign/buy-post-campaign.component';
import { CheckoutPostCampaignComponent } from './post/checkout-post-campaign/checkout-post-campaign.component';
import { CcampaignListComponent } from './ccampaign-list/ccampaign-list.component';


const routes: Routes = [
  {
    path: 'campaign-manager',
    component: CampaignManagerComponent,
    data: {
      title: "Campaign",
    }

  },
  {
    path: 'campaign-list',
    component: CcampaignListComponent,
    data: {
      title: "Campaign",
    }

  },
  {
    path: '',
    data: {
      title: "CampSearchEngine",
    },
    children: [
      {
        path: 'buy-search-engine',
        component: BuySearchEngineCampaignComponent,
        data: {
          title: "BuySearchEngineCamp",
        }
      }, {
        path: 'checkout-search-engine/:campaignId',
        component: CheckoutSearchEngineCampaignComponent,
        data: {
          title: "CampCheckOut",
        },

      }
    ]
  },
  {
    path: '',
    data: {
      title: "CampSponCon",
    },
    children: [
      {
        path: 'buy-top-contributor',
        component: BuyTopContributorCampaignComponent,
        data: {
          title: "BuyponConCamp",
        }
      }, {
        path: 'checkout-top-contributor/:campaignId',
        component: CheckoutTopContributorCampaignComponent,
        data: {
          title: "CampCheckOut",
        },

      }
    ]

  },
  {
    path: '',
    data: {
      title: "CampSponPost",
    }, children: [

      {
        path: 'buy-sponsored-post',
        component: BuyPostCampaignComponent,
        data: {
          title: "BuySponPostCamp",
        }
      }, {
        path: 'checkout-sponsored-post/:campaignId',
        component: CheckoutPostCampaignComponent,
        data: {
          title: "CampCheckOut",
        },

      }
    ]

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
