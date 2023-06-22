import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlockedProfileGuard } from '../shared/guard/blocked-profile.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'video-conference',
    loadChildren: () => import('./video-conference/video-conference.module').then(m => m.VideoConferenceModule)
  },
  {
    path: 'video-conference/:lsessionid',
    loadChildren: () => import('./video-conference/video-conference.module').then(m => m.VideoConferenceModule)
  },
  {
    path: 'service',
    loadChildren: () => import('./service/service.module').then(m => m.ServiceModule)
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
    path: 'service/:userSlug/:slug',
    loadChildren: () => import('./servicesingle/service.module').then(m => m.ServiceModule)
  },
  {
    path: 'profile/:authorSlug',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
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
    path: 'about',
    loadChildren: () => import('./about/about.module').then(m => m.AboutModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./search-engine/search-engine.module').then(m => m.SearchEngineModule)
  },
  {
    path: 'buy',
    loadChildren: () => import('./buy/buy.module').then(m => m.BuyModule)
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
  // {
  //   path: '**',
  //   component: HomeComponent,
  //   data: {
  //     title: 'Home',
  //     headerDisplay: 'none'
  //   }
  // },
  {
    path: 'story/:slug',
    loadChildren: () => import('./story/story.module').then(m => m.StoryModule)
  },
  {
    path: 'subscribe/:user_type',
    loadChildren: () => import('./subscribe-user-type/subscribe-user-type.module').then(m => m.SubscribeUserTypeModule),
    data: {
      lang: 'en'
    }
  },
  {
    path: 'abonnezvous/:user_type',
    loadChildren: () => import('./subscribe-user-type/subscribe-user-type.module').then(m => m.SubscribeUserTypeModule),
    data: {
      lang: 'fr'
    }
  },
  {
    path: 'suscribete/:user_type',
    loadChildren: () => import('./subscribe-user-type/subscribe-user-type.module').then(m => m.SubscribeUserTypeModule),
    data: {
      lang: 'es'
    }
  },

  {
    path:'event-hosting',
    loadChildren:() => import('./event-hosting/event-hosting.module').then(m => m.EventHostingModule)
  },
  {
    path:'groups',
    loadChildren:() => import('./groups/groups.module').then(m => m.GroupsModule)
  },

  {
    path: ':userSlug/:slug',
    loadChildren: () => import('./article/article.module').then(m => m.ArticleModule)
  },
  {
    path: ':slug',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
    canActivate: [BlockedProfileGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
