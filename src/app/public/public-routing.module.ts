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


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: 'Home ',
      headerDisplay: "none"
    }
  },
  {
    path: 'category/:slug',
    component: CategoryComponent,
    data: {
      title: 'Category ',
      headerDisplay: "none"
    }
  },
  {
    path: 'article/:slug',
    component: ArticleComponent,
    data: {
      title: 'Article',
      headerDisplay: "none"
    }
  },
  {
    path: 'profile/:slug',
    component: ProfileComponent,
    data: {
      title: 'Profile',
      headerDisplay: "none"
    }
  },
  {
    path: 'copywriter1',
    component: Copywriter1Component,
    data: {
      title: 'Copywriter version 1',
      headerDisplay: "none"
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
    path: 'contact',
    component: ContactComponent,
    data: {
      title: 'contact version 2',
      headerDisplay: "none"
    }
  },
  {
    path: 'terms',
    component: TermsComponent,
    data: {
      title: 'terms version 2',
      headerDisplay: "none"
    }
  },
  {
    path: 'faq',
    component: FaqComponent,
    data: {
      title: 'faq version 2',
      headerDisplay: "none"
    }

  },
  {
    path: 'search',
    component: SearchEngineComponent,
    data: {
      title: 'faq version 2',
      headerDisplay: "none"
    }

  },
  {
    path: 'buy',
    component: BuyComponent,
    data: {
      title: 'faq version 2',
      headerDisplay: "none"
    }

  },
  // {
  //   path: '**',
  //   component: HomeComponent,
  //   data: {
  //     title: 'Home',
  //     headerDisplay: "none"
  //   }

  // },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
