import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule, createTranslateLoader } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleSingleComponent } from './article-single/article-single.component';
import { ArticleImageComponent } from './article-form/article-image/article-image.component';
import { ArticleNetworkComponent } from './article-form/article-network/article-network.component';
import { ArticleSeoComponent } from './article-form/article-seo/article-seo.component';
import { ArticlePublishComponent } from './article-form/article-publish/article-publish.component';
import { ArticleContentComponent } from './article-form/article-content/article-content.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';



@NgModule({
  declarations: [ArticleListComponent, ArticleSingleComponent, ArticleImageComponent, ArticleNetworkComponent, ArticleSeoComponent, ArticlePublishComponent, ArticleContentComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ArticlesRoutingModule,
    QuillModule,
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } })
  ]
})
export class ArticlesModule { }
