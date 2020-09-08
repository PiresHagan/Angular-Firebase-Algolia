import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './post-list/post-list.component';
import { CreatePostComponent } from './create-post/create-post.component';

const routes: Routes = [{
  path: '',
  children: [
    {
      path: 'create-post',
      component: CreatePostComponent,
      data: {
        title: "Create Post"
      },
    },
    {
      path: 'post-list',
      component: PostListComponent,
      data: {
        title: "My Post's"
      }
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocialSharingRoutingModule { }
