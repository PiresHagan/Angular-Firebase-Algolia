import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleSingleComponent } from './article-single/article-single.component';
import { ArticleImageComponent } from './article-form/article-image/article-image.component';
import { ArticleSeoComponent } from './article-form/article-seo/article-seo.component';
import { ArticleNetworkComponent } from './article-form/article-network/article-network.component';
import { ArticlePublishComponent } from './article-form/article-publish/article-publish.component';
import { ArticleContentComponent } from './article-form/article-content/article-content.component';
import { AuthGuard } from 'src/app/shared/guard/auth.guard';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ArticleListComponent,
        data: {
          title: "myArticles"
        }
      },
      {
        path: 'single/:slug',
        component: ArticleSingleComponent,
        data: {
          title: 'myFirstArt'
        }
      },
      {
        path: 'compose',
        children: [
          {
            path: '',
            component: ArticleContentComponent,
            data: {
              title: 'artCompose'
            }
          },
          {
            path: 'image/:articleId',
            component: ArticleImageComponent,
            data: {
              title: 'artFeaturedImage'
            }
          },
          {
            path: 'promote',
            component: ArticleSeoComponent,
            data: {
              title: 'artPromote'
            }
          },
          {
            path: 'publish',
            component: ArticlePublishComponent,
            data: {
              title: 'artPublish'
            }
          }
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesRoutingModule { }
