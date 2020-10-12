import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CategoryComponent } from './category/category.component';
import { ArticleComponent } from './article/article.component';
import { ProfileComponent } from './profile/profile.component';
import { Copywriter1Component } from './copywriter1/copywriter1.component';
import { Copywriter2Component } from './copywriter2/copywriter2.component';
import { ContactComponent } from './contact/contact.component';
import { TermsComponent } from './terms/terms.component';
import { FaqComponent } from './faq/faq.component';
import { SearchEngineComponent } from './search-engine/search-engine.component';
import { BuyComponent } from './buy/buy.component';
import { InfluencerComponent } from './influencer/influencer.component';
import { TodayComponent } from './today/today.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { VideoComponent } from './video/video.component';
import { AudioComponent } from './audio/audio.component';
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
    component: ProfileComponent,
    data: {
      title: 'Profile',
      headerDisplay: 'none'
    }
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
    component: ContactComponent,
    data: {
      title: 'contact version 2',
      headerDisplay: 'none'
    }
  },
  {
    path: 'terms',
    component: TermsComponent,
    data: {
      title: 'terms version 2',
      headerDisplay: 'none'
    }
  },
  {
    path: 'privacy',
    component: PrivacyComponent,
    data: {
      title: 'privacy policies',
      headerDisplay: 'none'
    }
  },
  {
    path: 'faq',
    component: FaqComponent,
    data: {
      title: 'faq version 2',
      headerDisplay: 'none'
    }

  },
  {
    path: 'search',
    component: SearchEngineComponent,
    data: {
      title: 'faq version 2',
      headerDisplay: 'none'
    }

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
    path: 'video',
    component: VideoComponent,
    data: {
      title: 'video',
      headerDisplay: 'none'
    }
  },
  {
    path: 'audio',
    component: AudioComponent,
    data: {
      title: 'audio',
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
  // {
  //   path: '**',
  //   component: HomeComponent,
  //   data: {
  //     title: 'Home',
  //     headerDisplay: 'none'
  //   }
  // },
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
    component: ProfileComponent,
    data: {
      title: 'Profile',
      headerDisplay: 'none'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
