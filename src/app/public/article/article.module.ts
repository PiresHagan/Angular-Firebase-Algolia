import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleComponent } from './article.component';

import { ArticleRoutingModule } from './article-routing.module';
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';
import { createTranslateLoader, SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { QuillModule } from 'ngx-quill';
import { SimilarArticlesComponent } from './similar-articles/similar-articles.component';
import { ArticleCommentsComponent } from './article-comments/article-comments.component';

@NgModule({
  declarations: [
    ArticleComponent,
    SimilarArticlesComponent,
    ArticleCommentsComponent
  ],
  imports: [
    ArticleRoutingModule,
    CloudinaryModule.forRoot({ Cloudinary }, { cloud_name: 'mytrendingstories' } as CloudinaryConfiguration),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } }),
    QuillModule.forRoot(),
  ]
})

export class ArticleModule { }
