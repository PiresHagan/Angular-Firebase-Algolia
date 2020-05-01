import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { HomeComponent } from './home/home.component';
import { CategoryComponent } from './category/category.component';
import { ArticleComponent } from './article/article.component';
import { ProfileComponent } from './profile/profile.component';
import { Copywritter1Component } from './copywritter1/copywritter1.component';
import { Copywritter2Component } from './copywritter2/copywritter2.component';


@NgModule({
  declarations: [HomeComponent, CategoryComponent, ArticleComponent, ProfileComponent, Copywritter1Component, Copywritter2Component],
  imports: [
    CommonModule,
    PublicRoutingModule
  ]
})
export class PublicModule { }
