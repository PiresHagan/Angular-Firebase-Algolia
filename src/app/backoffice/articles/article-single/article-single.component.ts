import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ArticleService } from 'src/app/shared/services/article.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ThemeConstantService } from 'src/app/shared/services/theme-constant.service';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Article } from 'src/app/shared/interfaces/article.type';
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


  constructor(
    private articleService: ArticleService,
    private route: ActivatedRoute,
    public translate: TranslateService,
    public authService: AuthService,
    public userService: UserService,

  ) {
  }

  ngOnInit() {
    window.addEventListener('scroll', this.scrollEvent, true);
    this.route.paramMap.subscribe(params => {

      const slug = params.get('slug');
      this.articleService.getArtical(slug).subscribe(artical => {
        this.article = artical[0];
        this.getArticleComments(this.article.id);
      });

    });

    this.setUserDetails();

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
      latestURL = latestURL.replace('https://mytrendingstories.com/', "http://assets.mytrendingstories.com/");
      latestURL = latestURL.replace('https://cdn.mytrendingstories.com/', "http://assets.mytrendingstories.com/");
    }
    return latestURL;
  }


}
