import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';

import { Article } from 'src/app/shared/interfaces/article.type';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { ArticleService } from 'src/app/shared/services/article.service';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { User } from 'src/app/shared/interfaces/user.type';

@Component({
  selector: 'app-article-comments',
  templateUrl: './article-comments.component.html',
  styleUrls: ['./article-comments.component.scss']
})
export class ArticleCommentsComponent implements OnInit {

  @Input() article: Article
  @Input() isLoggedInUser;
  editedCommentId: string;
  lastCommentDoc: any;
  articleComments: any = [];
  commentForm: FormGroup;
  replyMessage: string;
  activeComment: Comment;
  messageDetails: string;
  userDetails: User;
  isFormSaving: boolean = false;
  isCommentsLoading: boolean = false;
  isCommentSavedSuccessfully: boolean = false;
  isReportAbuseLoading: boolean = false;
  
  @ViewChild('commentSection') private myScrollContainer: ElementRef;
  @ViewChild('commentReplySection') private commentReplyContainer: ElementRef;

  constructor(
    private articleService: ArticleService,
    private analyticsService: AnalyticsService,
    private authService: AuthService,
    private modal: NzModalService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.getArticleComments(this.article.id);

    this.setUserDetails();
  }

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
      } else {
        this.userDetails = null;
        this.isLoggedInUser = false;
      }
    })
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

      const article = this.article;
      this.analyticsService.logEvent('article_comment', {
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

  saveCommentOnServer(commentData) {
    this.articleService.createComment(this.article.id, commentData).subscribe(() => {
      this.isFormSaving = false;
      this.messageDetails = '';
      this.showCommentSavedMessage();
      this.newComment();
    }, () => {

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

  replyComment(commentData) {
    this.replyMessage = commentData.message;
    this.scrollToEditCommentSection();
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

  getUserDetails() {
    return {
      fullname: this.userDetails.fullname,
      slug: this.userDetails.slug ? this.userDetails.slug : '',
      avatar: this.userDetails.avatar ? this.userDetails.avatar : '',
      id: this.userDetails.id,
    }
  }

  reportAbuseComment(commentid) {
    this.isReportAbuseLoading = true;
    this.articleService.updateArticleCommentAbuse(this.article.id, commentid).then(() => {
      this.isReportAbuseLoading = false;
      this.showAbuseSuccessMessage();
    })
  }

  showAbuseSuccessMessage() {
    this.modal.success({
      nzTitle: this.translate.instant('Report'),
      nzContent: this.translate.instant('ReportMessage')
    });
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

}
