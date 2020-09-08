import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePostComponent } from './create-post/create-post.component';
import { SocialSharingRoutingModule } from './social-sharing.routing.module';
import { PostListComponent } from './post-list/post-list.component';

@NgModule({
  declarations: [CreatePostComponent, PostListComponent],
  imports: [
    CommonModule,
    SocialSharingRoutingModule
  ]
})
export class SocialSharingModule { }
