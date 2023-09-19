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
    path: 'hair-salon',
    loadChildren: () => import('./hair-salon/hair-salon.module').then(m => m.HairSalonModule)
  },
  {
    path: 'politician',
    loadChildren: () => import('./politician/politician.module').then(m => m.PoliticianModule)
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
    path: 'jobs',
    loadChildren: () => import('./jobs/jobs.module').then(m => m.JobsModule)
  },
  {
    path: 'job/search-by-company',
    loadChildren: () => import('./jobs/jobsearchbyCompany/jobSearchByCompany.module').then(m => m.jobSearchByCompanyModule)
  },
  {
    path: 'job-detail/:id',
    loadChildren: () => import('./jobs/jobCompanyDetail/jobdetail.module').then(m => m.JobDetailModule)
  },
  {
    path: 'jobs/candidate-detail',
    loadChildren: () => import('./jobs/jobCandidateDetail/jobCandidateDetail.module').then(m => m.jobCandidateDetailModule)
  },
  {
    path: 'job/search-by-categories',
    loadChildren: () => import('./jobs/jobsearchbyCategories/jobsearchbyCategories.module').then(m => m.jobsearchbyCategoriesModule)
  },
  {
    path: 'job/search-by-candidates',
    loadChildren: () => import('./jobs/jobsearchbyCandidates/jobsearchbyCandidates.module').then(m => m.jobsearchbyCandidatesModule)
  },
  {
    path: 'job/joblist',
    loadChildren: () => import('./jobs/jobsList/jobsList.module').then(m => m.jobListModule)
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
  {
    path: 'influencer',
    loadChildren: () => import('./influencer/influencer.module').then(m => m.InfluencerModule)
  },
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
    path: 'event-hosting',
    loadChildren: () => import('./event-hosting/event-hosting.module').then(m => m.EventHostingModule)
  },
  {
    path: 'groups',
    loadChildren: () => import('./groups/groups.module').then(m => m.GroupsModule)
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
