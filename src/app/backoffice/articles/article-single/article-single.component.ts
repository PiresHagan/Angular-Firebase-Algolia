import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ArticleService } from 'src/app/shared/services/article.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ThemeConstantService } from 'src/app/shared/services/theme-constant.service';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Article } from 'src/app/shared/interfaces/article.type';
import { BackofficeArticleService } from '../../shared/services/backoffice-article.service';
import { AUDIO, VIDEO } from 'src/app/shared/constants/article-constants';
import { DomSanitizer } from '@angular/platform-browser';
import { NzModalService } from 'ng-zorro-antd';
import { STAFF } from 'src/app/shared/constants/member-constant';
import { AngularFireAuth } from '@angular/fire/auth';

//import { } from '@types/gapi';

//declare var gapi: any;

@Component({
  selector: 'app-article-single',
  templateUrl: './article-single.component.html',
  styleUrls: ['./article-single.component.scss']
})
export class ArticleSingleComponent implements OnInit {

  loading = false;
  authConfig: any;
  article: Article = {};
  isLoggedInUser: boolean = false;
  userDetails;
  articleComments;
  loadingMore: boolean = false;
  lastVisible: any = null;
  fileURL: string;
  AUDIO = AUDIO;
  VIDEO = VIDEO;
  isStaff = false;

  constructor(
    private articleService: BackofficeArticleService,
    private route: ActivatedRoute,
    public translate: TranslateService,
    public authService: AuthService,
    public userService: UserService,
    private sanitizer: DomSanitizer,
    private modalService: NzModalService,
    private afAuth: AngularFireAuth,

  ) {
  }

  ngOnInit() {


    window.addEventListener('scroll', this.scrollEvent, true);
    this.route.paramMap.subscribe(params => {

      const slug = params.get('slug');
      this.articleService.getArtical(slug).subscribe(artical => {
        this.article = artical[0];
        const format = 'mp4';
        this.fileURL = this.article.type === "video" && `https://player.cloudinary.com/embed/?cloud_name=mytrendingstories&public_id=${this.article.article_file.cloudinary_id}&fluid=true&controls=true&source_types%5B0%5D=${format}`

        this.getArticleComments(this.article.id);
      });

    });

    this.setUserDetails();


    this.afAuth.authState.subscribe(() => {
      this.authService.getCustomClaimData().then((role) => {
        if (role == STAFF) {
          this.isStaff = true;
        }
      })
    })

  }
  /**
  * Get Article comments using Article Id
  * @param articleId 
  */
  getArticleComments(articleId) {
    this.articleService.getArticaleComments(articleId).subscribe(({ commentList, lastCommentDoc }) => {

      this.articleComments = commentList
      this.lastVisible = lastCommentDoc
    })
  }

  /**
   * Set user params 
   */
  setUserDetails() {
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;
      this.userDetails = await this.authService.getLoggedInUserDetails();

    })



    // this.authService.getAuthState().subscribe(user => {
    //   if (user && !user.isAnonymous) {
    //     this.isLoggedInUser = true;
    //   } else {
    //     this.userDetails = null;
    //     this.isLoggedInUser = false;
    //   }
    // });
    // this.userService.getCurrentUser().then((user) => {
    //   this.userService.get(user.id).subscribe((userDetails) => {
    //     this.userDetails = userDetails;
    //   })
    // })
  }

  scrollEvent = (event: any): void => {
    const top = event.target.documentElement.scrollTop
    const height = event.target.documentElement.scrollHeight
    const offset = event.target.documentElement.offsetHeight
    if (top > height - offset - 1 && this.lastVisible) {
      this.loadingMore = true;
      this.articleService.getArticleCommentNextPage(this.article.id, null, this.lastVisible).subscribe((data) => {
        this.loadingMore = false;
        this.articleComments = [...this.articleComments, ...data.commentList];
        console.log(this.articleComments.length)
        this.lastVisible = data.lastCommentDoc;
      });
    }
  }
  replaceImage(url) {
    let latestURL = url
    if (url) {
      latestURL = latestURL.replace('https://mytrendingstories.com/', "https://assets.mytrendingstories.com/")
        .replace('http://cdn.mytrendingstories.com/', "https://cdn.mytrendingstories.com/")
        .replace('https://abc2020new.com/', "https://assets.mytrendingstories.com/");
    }
    return latestURL;
  }

  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }


  deleteComment(articleId: string, commentId: string) {
    this.authService.getCustomClaimData().then((role) => {
      if (role == STAFF) {
        let commentMessageConf = this.translate.instant("DeletMsgConf");
        let commentMessageSucc = this.translate.instant("DeletMsgSuc");
        let commentErrorMsg = this.translate.instant("somethingWrongErr");
        this.modalService.confirm({
          nzContent: commentMessageConf,
          nzOnOk: () =>
            new Promise((resolve, reject) => {
              this.articleService.deleteComment(articleId, commentId).subscribe(() => {
                this.modalService.success({
                  nzTitle: "<i>" + commentMessageSucc + "</i>",
                });
                resolve();
              }, (err) => {
                this.modalService.error({
                  nzTitle: "<i>" + commentErrorMsg + "</i>",
                });
                reject();
              })
            }).catch(() => console.log('Oops errors!'))
        });
      }

    })

  }

}
