import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { HomeComponent } from './home/home.component';
import { CategoryComponent } from './category/category.component';
import { ArticleComponent } from './article/article.component';
import { ProfileComponent } from './profile/profile.component';
import { Copywriter1Component } from './copywriter1/copywriter1.component';
import { Copywriter2Component } from './copywriter2/copywriter2.component';


@NgModule({
  declarations: [HomeComponent, CategoryComponent, ArticleComponent, ProfileComponent, Copywriter1Component, Copywriter2Component],
  imports: [
    CommonModule,
    PublicRoutingModule
  ]
})
export class PublicModule { }
