import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';

import { Event } from 'src/app/shared/interfaces/event.type';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { EventsService } from 'src/app/shared/services/events.services';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { User } from 'src/app/shared/interfaces/user.type';

@Component({
  selector: 'app-article-comments',
  templateUrl: './event-comments.component.html',
  styleUrls: ['./event-comments.component.scss']
})
export class ArticleCommentsComponent implements OnInit {

  @Input() event: Event
  @Input() isLoggedInUser;
  @Input() rate_count;
  @Input() rate_sum;
  editedCommentId: string;
  lastCommentDoc: any;
  eventComments: any = [];
  commentForm: FormGroup;
  replyMessage: string;
  activeComment: Comment;
  messageDetails: string;
  userDetails: User;
  isFormSaving: boolean = false;
  isCommentsLoading: boolean = false;
  isCommentSavedSuccessfully: boolean = false;
  isReportAbuseLoading: boolean = false;
  rating: number = 0;
  total_rating: number = 0;

  @ViewChild('commentSection') private myScrollContainer: ElementRef;
  @ViewChild('commentReplySection') private commentReplyContainer: ElementRef;

  constructor(
    private eventService: EventsService,
    private analyticsService: AnalyticsService,
    private authService: AuthService,
    private modal: NzModalService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.getEventComments(this.event.id);
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

  getEventComments(articleId) {
    try {
      this.eventService.getEventComments(articleId).subscribe(({ commentList, lastCommentDoc }) => {
        this.eventComments = commentList;
        this.lastCommentDoc = lastCommentDoc
      })
    }
    catch (e) {
      console.log(e);
    }
  }
  likeComment(commentData) {
    // get comment count and update comment
    // check user comment
    if (this.userDetails == null) {
      this.showWarningMessage(this.translate.getTranslation("LogInFirst"));
      return;
    }
    if (this.userDetails?.id === commentData?.author?.id) {
      this.showWarningMessage(this.translate.getTranslation("CantLikeYourComment"));
      return;
    }

    let likes = [];
    if (commentData['users_like'] != null)
      likes = commentData['users_like'];
    if (likes.indexOf(this.userDetails.id) == -1) {
      likes.push(this.userDetails.id);
      if (commentData['likes_count'] == null)
        commentData['likes_count'] = 0;
      commentData['likes_count'] = commentData['likes_count'] + 1;
      commentData['users_like'] = likes;
    }
    else {
      this.showWarningMessage(this.translate.getTranslation("AlreadyLikedComment"));
      return;
    }

    this.eventService.LikeEventComment(this.event.id, commentData.id, commentData,"1").subscribe(() => {
      this.messageDetails = '';
      this.showCommentSavedMessage();
      this.newComment();

    }, () => {

    })
  }
  setRate(rate: number) {
    this.rating = rate;
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
        author: this.getUserDetails(),
        rating: this.rating

      };
      if (this.editedCommentId) {
        this.updateCommentOnServer(this.editedCommentId, commentData);
      } else {
        commentData['likes_count'] = 0;
        this.saveCommentOnServer(commentData);
      }

      const article = this.event;

      this.analyticsService.logEvent('event_comment', {
        article_id: article.id,
        article_title: article.event_name,
        // article_language: article.lang,
        // article_author_name: article.author.fullname,
        article_author_id: article.owner.id,
        article_category_title: article.event_type,
        // article_category_id: article.category.id,
        commented_by_user_name: this.getUserDetails().fullname,
        commented_by_user_id: this.getUserDetails().id,
      });
      this.rate_count += 1;
      this.rate_sum += this.rating;

    }
  }
  showWarningMessage(message) {
    let $message = this.translate.instant(message);
    this.modal.warning({
      nzTitle: $message,
    });
  }
  saveCommentOnServer(commentData) {
    this.eventService.createEventComment(this.event.id, commentData).subscribe((res) => {
      this.isFormSaving = false;
      this.messageDetails = '';
      this.showCommentSavedMessage();
      this.newComment();
    }, () => {

      this.isFormSaving = false;

      this.rating = 0;
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

    this.eventService.updateEventComment(this.event.id, editedCommentId, commentData).subscribe(() => {
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
    /* this.isCommentsLoading = true;
     this.articleService.getEventCommentNextPage(this.event.id, 5, this.lastCommentDoc).subscribe(({ commentList, lastCommentDoc }) => {
       this.lastCommentDoc = lastCommentDoc
       this.eventComments = [...this.eventComments, ...commentList];
       this.isCommentsLoading = false;
 
     })*/
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
