import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CampaignManagerComponent } from './campaign-manager/campaign-manager.component';

import { UpdateBillingComponent } from './update-billing/update-billing.component';
import { TopContributorCampaignComponent } from './top-contributer/top-contributor-campaign/top-contributor-campaign.component';
import { BuyTopContributorCampaignComponent } from './top-contributer/buy-top-contributor-campaign/buy-top-contributor-campaign.component';
import { CheckoutTopContributorCampaignComponent } from './top-contributer/checkout-top-contributor-campaign/checkout-top-contributor-campaign.component';
import { CheckoutSuccessTopContributorCampaignComponent } from './top-contributer/checkout-success-top-contributor-campaign/checkout-success-top-contributor-campaign.component';
import { SearchEngineCampaignComponent } from './search-engine/search-engine-campaign/search-engine-campaign.component';
import { BuySearchEngineCampaignComponent } from './search-engine/buy-search-engine-campaign/buy-search-engine-campaign.component';
import { CheckoutSearchEngineCampaignComponent } from './search-engine/checkout-search-engine-campaign/checkout-search-engine-campaign.component';
import { CheckoutSuccessSearchEngineCampaignComponent } from './search-engine/checkout-success-search-engine-campaign/checkout-success-search-engine-campaign.component';
import { PostCampaignComponent } from './post/post-campaign/post-campaign.component';
import { BuyPostCampaignComponent } from './post/buy-post-campaign/buy-post-campaign.component';
import { CheckoutPostCampaignComponent } from './post/checkout-post-campaign/checkout-post-campaign.component';
import { CheckoutSuccessPostCampaignComponent } from './post/checkout-success-post-campaign/checkout-success-post-campaign.component';


const routes: Routes = [
  {
    path: 'campaign-manager',
    component: CampaignManagerComponent,
    data: {
      title: "Campaign",
    }

  },
  {
    path: 'search-engine',

    data: {
      title: "CampSearchEngine",
    },
    children: [
      {
        path: '',
        component: SearchEngineCampaignComponent,
        data: {
          title: "CampSearchEngine",
        }
      },
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
          title: "CampCheckout",
        },

      },
      {
        path: 'checkout-success-search-engine',
        component: CheckoutSuccessSearchEngineCampaignComponent,
        data: {
          title: "CampCheckOutSuccess",
        }
      }
    ]
  },
  {
    path: 'top-contributor',
    data: {
      title: "CampSponCon",
    },
    children: [
      {
        path: '',
        component: TopContributorCampaignComponent,
        data: {
          title: "CampSponCon",
        }
      },
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

      },
      {
        path: 'checkout-success-top-contributor',
        component: CheckoutSuccessTopContributorCampaignComponent,
        data: {
          title: "CampCheckOutSuccess",
        }
      }
    ]

  },
  {
    path: 'sponsored-post',
    data: {
      title: "CampSponPost",
    }, children: [
      {
        path: '',
        component: PostCampaignComponent,
        data: {
          title: "CampSponPost",
        }
      },
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
          title: "CampCheckout",
        },

      },
      {
        path: 'checkout-success-sponsored-post',
        component: CheckoutSuccessPostCampaignComponent,
        data: {
          title: "CampCheckOutSuccess",
        }
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
