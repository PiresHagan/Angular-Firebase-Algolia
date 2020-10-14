import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Copywriter1Component } from './copywriter1/copywriter1.component';
import { Copywriter2Component } from './copywriter2/copywriter2.component';
import { BuyComponent } from './buy/buy.component';
import { InfluencerComponent } from './influencer/influencer.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'shop',
    loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule)
  },
  {
    path: 'category/:slug',
    loadChildren: () => import('./category/category.module').then(m => m.CategoryModule)
  },
  {
    path: 'article/:slug',
    loadChildren: () => import('./article/article.module').then(m => m.ArticleModule)
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
      headerDisplay: 'none'
    }
  },
  {
    path: 'fundraisers',
    loadChildren: () => import('./fundraiser-list/fundraiser-list.module').then(m => m.FundraiserListModule)
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
    loadChildren: () => import('./today/today.module').then(m => m.TodayModule)
  },
  {
    path: 'companies',
    loadChildren: () => import('./companies/companies.module').then(m => m.CompaniesModule)
  },
  {
    path: 'charities',
    loadChildren: () => import('./charity-list/charity-list.module').then(m => m.CharityListModule)
  },
  {
    path: ':userSlug/:slug',
    loadChildren: () => import('./article/article.module').then(m => m.ArticleModule)
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
