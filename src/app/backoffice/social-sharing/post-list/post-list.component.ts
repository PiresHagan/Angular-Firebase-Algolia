import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AuthService } from 'src/app/shared/services/authentication.service';
import { BackofficeSocialSharingService } from '../../shared/services/backoffice-social-sharing.service';
import { Post } from 'src/app/shared/interfaces/social-sharing-post.type';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})


export class PostListComponent implements OnInit {

  userDetails;
  posts: Post[];
  lastVisible: any = null;
  loading: boolean = true;
  loadingMore: boolean = false;
  postsLimit = 20;

  constructor(
    public authService: AuthService,
    private socialSharigService: BackofficeSocialSharingService,
    private message: NzMessageService,
    private modal: NzModalService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scrollEvent, true);

    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;
      this.userDetails = await this.authService.getLoggedInUserDetails();
      if (this.userDetails) {
        this.getFirstPosts();
      }
    });
  }

  getFirstPosts() {
    this.socialSharigService.getPostsOnScroll(this.userDetails.id, this.postsLimit, 'first', this.lastVisible).subscribe((data) => {
      this.posts = data.postList;
      this.lastVisible = data.lastVisible;
      this.loading = false;
    });
  }

  scrollEvent = (event: any): void => {
    if (event.target && event.target.documentElement) {
      const top = event.target.documentElement.scrollTop
      const height = event.target.documentElement.scrollHeight
      const offset = event.target.documentElement.offsetHeight
      if (top > height - offset - 1 - 100 && this.lastVisible && !this.loadingMore) {
        this.loadingMore = true;
        this.socialSharigService.getPostsOnScroll(this.userDetails.id, this.postsLimit, 'next', this.lastVisible).subscribe((data) => {
          this.loadingMore = false;
          this.posts = [...this.posts, ...data.postList];
          this.lastVisible = data.lastVisible;
        });
      }
    }
  }

  showMessage(type: string, message: string) {
    this.message.create(type, message);
  }

  deletePost(post: Post) {
    this.translate.get("PostDeletMsgConf", { title: post.title }).subscribe((text:string) => {
      const title = text;
      this.modal.confirm({
        nzTitle: title,
        nzOnOk: () =>
          new Promise((resolve, reject) => {
            this.socialSharigService.deletePost(post.id).subscribe(() => {
              this.showMessage('success', this.translate.instant("PostDeleted"));
              resolve()
            }, error => {
              reject(error)
            })
  
          }).catch((err) => {
            this.showMessage('error', err.message);
          })
      });
    });
  }
 
}
