import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from 'src/app/shared/services/article.service';
import { Article } from 'src/app/shared/interfaces/article.type';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ThemeConstantService } from 'src/app/shared/services/theme-constant.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { UserService } from 'src/app/shared/services/user.service';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { User } from 'src/app/shared/interfaces/user.type';
import { DomSanitizer, Title, Meta } from '@angular/platform-browser';
import { AuthorService } from 'src/app/shared/services/author.service';
import { environment } from 'src/environments/environment';
import { LanguageService } from 'src/app/shared/services/language.service';
import * as firebase from 'firebase/app';
import { NzModalService } from 'ng-zorro-antd';
import { TEXT, AUDIO, VIDEO } from 'src/app/shared/constants/article-constants';
import * as moment from 'moment';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ArticleComponent implements OnInit {

  article: Article;
  articleType: string;
  articleLikes: number = 0;
  articleVicewCount: number = 0;
  slug: string;
  articleComments: any = [];
  commentForm: FormGroup;
  isFormSaving: boolean = false;
  isCommentSavedSuccessfully: boolean = false;
  isLoggedInUser: boolean = false;
  isCommentsLoading: boolean = false;
  isReportAbuseArticleLoading: boolean = false;
  editedCommentId: string;
  lastCommentDoc: any;
  userDetails: User;
  messageDetails: string;
  status: boolean;
  replyMessage: string;
  activeComment: Comment;
  isFollowing: boolean = false;
  isLike: boolean = false;
  isLoaded: boolean = false;
  isReportAbuseLoading: boolean = false;
  selectedLang: string = '';
  similarArticleList;
  selectedLanguage: string = "";
  TEXT = TEXT;
  AUDIO = AUDIO;
  VIDEO = VIDEO;
  @ViewChild('commentSection') private myScrollContainer: ElementRef;
  @ViewChild('commentReplySection') private commentReplyContainer: ElementRef;

  constructor(
    private articleService: ArticleService,
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
    public authService: AuthService,
    public authorService: AuthorService,
    public userService: UserService,
    private sanitizer: DomSanitizer,
    private titleService: Title,
    private metaTagService: Meta,
    private langService: LanguageService,
    private modal: NzModalService
  ) {

  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {

      this.selectedLanguage = this.langService.getSelectedLanguage();

      const slug = params.get('slug');
      this.articleService.getArtical(slug).subscribe(artical => {

        this.article = artical[0];
        if (!this.article) {
          this.modal.error({
            nzTitle: this.translate.instant('URL404'),
            nzContent: this.translate.instant('URLNotFound'),
            nzOnOk: () => { this.router.navigate(['/']) }
          })
          return
        }
        const articleId = this.article.id;

        this.similarArticleList = this.articleService.getCategoryRow(this.article.category.slug, this.selectedLanguage);

        this.articleType = this.article.type ? this.article.type : TEXT;
        this.articleLikes = this.article.likes_count;
        this.articleVicewCount = this.article.view_count;
        this.setUserDetails();
        this.getArticleComments(this.article.id);

        this.titleService.setTitle(`${this.article.title.substring(0, 69)}`);

        this.metaTagService.addTags([
          { name: "description", content: `${this.article.meta.description.substring(0, 154)}` },
          { name: "keywords", content: `${this.article.meta.keyword}` },
          { name: "twitter:card", content: `${this.article.summary}` },
          { name: "og:title", content: `${this.article.title}` },
          { name: "og:type", content: `article` },
          { name: "og:url", content: `${window.location.href}` },
          { name: "og:image", content: `${this.article.image.url}` },
          { name: "og:description", content: `${this.article.meta.description}` }
        ]);
        this.articleService.updateViewCount(articleId);
      });
      this.setLanguageNotification();

    });

  }
  ngAfterViewChecked(): void {
    if (!this.isLoaded) {
      delete window['addthis']
      setTimeout(() => { this.loadScript(); }, 100);
      this.isLoaded = true;
    }
  }

  /**
   * Get Article comments using Article Id
   * @param articleId 
   */
  getArticleComments(articleId) {
    this.articleService.getArticaleComments(articleId).subscribe(({ commentList, lastCommentDoc }) => {
      this.articleComments = commentList
      this.lastCommentDoc = lastCommentDoc
    })
  }

  /**
   * Set user params 
   */
  async setUserDetails() {

    this.authService.getAuthState().subscribe(async (user) => {
      if (!user) {
        this.userDetails = null;
        this.isLoggedInUser = false;
        return;
      }
      this.userDetails = await this.authService.getLoggedInUserDetails();
      if (this.userDetails) {
        this.isLoggedInUser = true;
        this.setFollowOrNot();
        this.setLike();
      } else {
        this.userDetails = null;
        this.isLoggedInUser = false;
      }



    })
  }



  /**
   * Save comment
   * @param form 
   */
  saveComments(form: NgForm) {
    if (form.valid) {
      this.isFormSaving = true;
      const commentData = {
        published_on: this.activeComment ? this.activeComment['published_on'] : new Date().toISOString(),
        replied_on: this.activeComment ? this.activeComment['replied_on'] : (this.replyMessage ? this.replyMessage : ''),
        message: this.messageDetails,
        author: this.getUserDetails()

      };
      if (this.editedCommentId) {
        this.updateCommentOnServer(this.editedCommentId, commentData);
      } else {
        this.saveCommentOnServer(commentData);
      }

      const analytics = firebase.analytics();
      const article = this.article;
      analytics.logEvent('article_comment', {
        article_id: article.id,
        article_title: article.title,
        article_language: article.lang,
        article_author_name: article.author.fullname,
        article_author_id: article.author.id,
        article_category_title: article.category.title,
        article_category_id: article.category.id,
        commented_by_user_name: this.getUserDetails().fullname,
        commented_by_user_id: this.getUserDetails().id,
      });

    }
  }

  /**
   * Scrolling to comment section.
   */
  scrollToCommentSection(): void {
    try {
      this.myScrollContainer.nativeElement.scrollIntoView({ behavior: 'smooth' })
    } catch (err) { console.log(err); }
  }


  scrollToEditCommentSection(): void {
    try {
      this.commentReplyContainer.nativeElement.scrollIntoView({ behavior: 'smooth' })
    } catch (err) { console.log(err); }
  }


  saveCommentOnServer(commentData) {
    this.articleService.createComment(this.article.id, commentData).subscribe(() => {
      this.isFormSaving = false;
      this.messageDetails = '';
      this.articleService.commentCount(this.article.id);
      this.showCommentSavedMessage();
      this.newComment();
    }, err => {

      this.isFormSaving = false;
    })
  }

  editComment(commentid: string, commentData) {
    this.activeComment = commentData;
    this.editedCommentId = commentid;
    this.messageDetails = commentData.message;
    this.replyMessage = '';
    this.scrollToEditCommentSection();
  }

  updateCommentOnServer(editedCommentId, commentData) {
    this.editedCommentId = '';

    this.articleService.updateComment(this.article.id, editedCommentId, commentData).subscribe(() => {
      this.isFormSaving = false;
      this.messageDetails = '';
      this.showCommentSavedMessage();
      this.newComment();

    }, () => {

      this.isFormSaving = false;
    })
  }

  newComment() {
    this.editedCommentId = '';
    this.messageDetails = '';
    this.replyMessage = '';
    this.activeComment = null;
  }

  loadMoreComments() {
    this.isCommentsLoading = true;
    this.articleService.getArticleCommentNextPage(this.article.id, 5, this.lastCommentDoc).subscribe(({ commentList, lastCommentDoc }) => {
      this.lastCommentDoc = lastCommentDoc
      this.articleComments = [...this.articleComments, ...commentList];
      this.isCommentsLoading = false;

    })
  }

  showCommentSavedMessage() {
    this.isCommentSavedSuccessfully = true;
    setTimeout(() => {
      this.scrollToCommentSection();
      this.isCommentSavedSuccessfully = false;
    }, 500)
  }

  replyComment(commentid: string, commentData) {
    this.replyMessage = commentData.message;
    this.scrollToEditCommentSection();
  }
  transformHtml(htmlTextWithStyle) {
    return this.sanitizer.bypassSecurityTrustHtml(htmlTextWithStyle);
  }
  reportAbuseArticle() {
    this.isReportAbuseArticleLoading = true;
    this.articleService.updateArticleAbuse(this.article.id).then(() => {
      this.isReportAbuseArticleLoading = false;
      console.log('Your suggestion saved successfully.')
    })
  }
  reportAbuseComment(commentid) {
    this.isReportAbuseLoading = true;
    this.articleService.updateArticleCommentAbuse(this.article.id, commentid).then(() => {
      this.isReportAbuseLoading = false;
      console.log('Your suggestion saved successfully.')
    })
  }
  getUserDetails() {
    return {
      fullname: this.userDetails.fullname,
      slug: this.userDetails.slug ? this.userDetails.slug : '',
      avatar: this.userDetails.avatar ? this.userDetails.avatar : '',
      id: this.userDetails.id,
    }
  }

  follow() {
    this.authorService.follow(this.article.author.id, this.article.author.type);
    const userDetails = this.getUserDetails();
    const analytics = firebase.analytics();
    analytics.logEvent("unfollow_author", {
      author_id: this.article.author.id,
      author_name: this.article.author.fullname,
      user_uid: userDetails.id,
      user_name: userDetails.fullname,
    });
  }
  unfollow() {
    this.authorService.unfollow(this.article.author.id, this.article.author.type);
    const userDetails = this.getUserDetails();
    const analytics = firebase.analytics();
    analytics.logEvent("unfollow_author", {
      author_id: this.article.author.id,
      author_name: this.article.author.fullname,
      user_uid: userDetails.id,
      user_name: userDetails.fullname,
    });
  }

  setFollowOrNot() {
    this.authorService.isUserFollowing(this.article.author.id, this.getUserDetails().id, this.article.author.type).subscribe((data) => {
      if (data) {
        this.isFollowing = true;
      } else {
        this.isFollowing = false;
      }
    });
  }
  like() {
    this.articleService.like(this.article.id, this.getUserDetails());
    const analytics = firebase.analytics();
    const article = this.article;
    analytics.logEvent('liked_article', {
      article_id: article.id,
      article_title: article.title,
      article_language: article.lang,
      article_author_name: article.author.fullname,
      article_author_id: article.author.id,
      article_category_title: article.category.title,
      article_category_id: article.category.id,
      liked_by_user_name: this.getUserDetails().fullname,
      liked_by_user_id: this.getUserDetails().id,
    });
  }
  disLike() {
    this.articleService.disLike(this.article.id, this.getUserDetails().id);
    const analytics = firebase.analytics();
    const article = this.article;
    analytics.logEvent('unliked_article', {
      article_id: article.id,
      article_title: article.title,
      article_language: article.lang,
      article_author_name: article.author.fullname,
      article_author_id: article.author.id,
      article_category_title: article.category.title,
      article_category_id: article.category.id,
      unliked_by_user_name: this.getUserDetails().fullname,
      unliked_by_user_id: this.getUserDetails().id,
    });
  }
  setLike() {

    this.articleService.isLikedByUser(this.article.id, this.getUserDetails().id).subscribe((data) => {
      if (data) {
        this.isLike = true;
      } else {
        this.isLike = false;
      }
    });
  }
  loadScript() {
    let node = document.createElement('script');
    node.src = environment.addThisScript;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
  }
  setLanguageNotification() {
    this.selectedLang = this.langService.getSelectedLanguage();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.selectedLang = this.langService.getSelectedLanguage();
    })
  }
  replaceImage(url) {
    let latestURL = url
    if (url) {
      latestURL = latestURL.replace('https://mytrendingstories.com/', "https://assets.mytrendingstories.com/")
        .replace('https://cdn.mytrendingstories.com/', "https://assets.mytrendingstories.com/")
        .replace('https://abc2020new.com/', "https://assets.mytrendingstories.com/");
    }
    return latestURL;
  }

  getRelativeDate(date: string) {
    return moment(date).fromNow();
  }

  getArticleUrl(article) {
    if (article.author.type == 'charity') {
      return '/charities/';
    } else if (article.author.type == 'company') {
      return '/companies/';
    }
    else{
      return '/';
    }
  }

}

