import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CategoryComponent } from './category/category.component';
import { ArticleComponent } from './article/article.component';
import { ProfileComponent } from './profile/profile.component';
import { Copywritter1Component } from './copywritter1/copywritter1.component';
import { Copywritter2Component } from './copywritter2/copywritter2.component';


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
    path: 'article',
    component: ArticleComponent,
    data: {
      title: 'Article',
      headerDisplay: "none"
    }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: {
      title: 'Profile',
      headerDisplay: "none"
    }
  },
  {
    path: 'copywritter1',
    component: Copywritter1Component,
    data: {
      title: 'Copywritter version 1',
      headerDisplay: "none"
    }
  },
  {
    path: 'copywritter2',
    component: Copywritter2Component,
    data: {
      title: 'Copywritter version 2',
      headerDisplay: "none"
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
