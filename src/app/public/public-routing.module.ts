import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CategoryComponent } from './category/category.component';
import { ArticleComponent } from './article/article.component';
import { Copywriter1Component } from './copywriter1/copywriter1.component';
import { Copywriter2Component } from './copywriter2/copywriter2.component';
import { BuyComponent } from './buy/buy.component';
import { InfluencerComponent } from './influencer/influencer.component';
import { TodayComponent } from './today/today.component';
import { CompanyComponent } from './company/company.component';
import { CompaniesComponent } from './companies/companies.component';
import { CharityComponent } from './charity/charity.component';
import { CharityListComponent } from './charity-list/charity-list.component';
import { FundraiserComponent } from './fundraiser/fundraiser.component';
import { FundraiserListComponent } from './fundraiser-list/fundraiser-list.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: 'Home ',
      headerDisplay: 'none'
    }
  },
  {
    path: 'shop',
    loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule)
  },
  {
    path: 'category/:slug',
    component: CategoryComponent,
    data: {
      title: 'Category ',
      headerDisplay: 'none'
    }
  },
  {
    path: 'article/:slug',
    component: ArticleComponent,
    data: {
      title: 'Article',
      headerDisplay: 'none'
    }
  },
  {
    path: 'profile/:slug',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'copywriter1',
    component: Copywriter1Component,
    data: {
      title: 'Copywriter version 1',
      headerDisplay: 'none'
    }
  },
  {
    path: 'copywriter2',
    component: Copywriter2Component,
    data: {
      title: 'Copywriter version 2',
      headerDisplay: "none"
    }
  },
  {
    path: 'fundraisers/:slug',
    component: FundraiserComponent,
    data: {
      title: 'fundraiser',
      headerDisplay: 'none'
    }
  },
  {
    path: 'fundraisers',
    component: FundraiserListComponent,
    data: {
      title: 'fundraisers',
      headerDisplay: 'none'
    }
  },
  {
    path: 'contact',
    loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule)
  },
  {
    path: 'terms',
    loadChildren: () => import('./terms/terms.module').then(m => m.TermsModule)
  },
  {
    path: 'privacy',
    loadChildren: () => import('./privacy/privacy.module').then(m => m.PrivacyModule)
  },
  {
    path: 'faq',
    loadChildren: () => import('./faq/faq.module').then(m => m.FaqModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./search-engine/search-engine.module').then(m => m.SearchEngineModule)
  },
  {
    path: 'buy',
    component: BuyComponent,
    data: {
      title: 'faq version 2',
      headerDisplay: 'none'
    }

  },
  {
    path: 'influencer',
    component: InfluencerComponent,
    data: {
      title: 'influencer version 2',
      headerDisplay: 'none'
    }
  },
  {
    path: 'today',
    component: TodayComponent,
    data: {
      title: 'today version 2',
      headerDisplay: 'none'
    }
  },
  {
    path: 'companies',
    component: CompaniesComponent,
    data: {
      title: 'companies',
      headerDisplay: 'none'
    }
  },
  {
    path: 'companies/:slug',
    component: CompanyComponent,
    data: {
      title: 'company',
      headerDisplay: 'none'
    }
  },
  {
    path: 'charities',
    component: CharityListComponent,
    data: {
      title: 'charities',
      headerDisplay: 'none'
    }
  },
  {
    path: 'charities/:slug',
    component: CharityComponent,
    data: {
      title: 'charity',
      headerDisplay: 'none'
    }
  },
  {
    path: ':userSlug/:slug',
    component: ArticleComponent,
    data: {
      title: 'Article',
      headerDisplay: 'none'
    }
  },
  {
    path: ':slug',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
