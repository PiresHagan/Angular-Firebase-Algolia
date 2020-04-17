import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CategoryComponent } from './category/category.component';
import { ArticleComponent } from './article/article.component';
import { ProfileComponent } from './profile/profile.component';


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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
