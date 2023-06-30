import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';

import { Event } from 'src/app/shared/interfaces/event.type';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { GroupsService } from 'src/app/shared/services/group.service';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { User } from 'src/app/shared/interfaces/user.type';
import { Group } from 'src/app/shared/interfaces/group.type';
import { DOCUMENT } from '@angular/common';

import { ConstantPool } from '@angular/compiler';
import { Console } from 'console';

@Component({
  selector: 'app-article-comments',
  templateUrl: './group-comments.component.html',
  styleUrls: ['./group-comments.component.scss']
})
export class ArticleCommentsComponent implements OnInit {

  @Input() event: Group;
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
  canReply: boolean = false;
  canRate: boolean = false;
  isAdmin: boolean = false;
  isReply: boolean = false;
  commentedReply: string;
  replies: any;

  @ViewChild('commentSection') private myScrollContainer: ElementRef;
  @ViewChild('commentReplySection') private commentReplyContainer: ElementRef;
  constructor(
    private groupService: GroupsService,
    private analyticsService: AnalyticsService,
    private authService: AuthService,
    private modal: NzModalService,
    public translate: TranslateService,
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
        if (this.userDetails.type === "staff") {
          this.isAdmin = true;
        }
        // can the user comment? =>he should be host and one of the groups

        //canCommentEvent(this.userDetails.id, this.event);
        // can the user rate? => he/she should be just the groups
        this.canRateFunction(this.userDetails.id, this.event);
        
      } else {
        this.userDetails = null;
        this.isLoggedInUser = false;
      }
    })
  }
  canRateFunction(userId: string, group: Group) {
    if(!this.canCommentFunction(userId,group)){
    this.groupService.getEventFirstGroupJoined(userId, group).subscribe((data) => {
      // check if these events has the user joined in the second team?
      for (let i = 0; i < data.eventList.length; i++) {
        if (data.eventList[i].second_joind_group != null && data.eventList[i].second_joind_group.MemberIds.includes(userId)) {
          this.canRate = true;
          this.canReply=true;
        }
        else if (data.eventList[i].owner.id == userId)
          this.canRate = true;
          this.canReply = true;
      }

      // check other list of events where they joined as a second group
      if (!this.canRate) {
        this.groupService.getEventSecondGroupJoined(userId, group).subscribe((data2) => {
          // check if these events has the user joined in the second team?
          for (let i = 0; i < data2.eventList.length; i++) {
            if (data2.eventList[i].first_joind_group != null && data2.eventList[i].first_joind_group.MemberIds.includes(userId)) {
              this.canRate = true;
              this.canReply = true;
            }
            else if (data2.eventList[i].owner.id == userId) {
              this.canRate = true;
              this.canReply = true;
            }
          }

          this.canRate = false;
        });
      }
    });
  }
  else{
    this.canReply = true;
    this.canRate = false;
  }
  }

  canCommentFunction(userId: string, group: Group) {
    if (group.MemberIds.includes(userId))
      return true;
    else return false;
  }

  /**
   * Get Article comments using Article Id
   * @param articleId 
   */

  getEventComments(articleId) {
    try {
      this.groupService.getGroupComments(articleId).subscribe(({ commentList, lastCommentDoc }) => {
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
      this.showWarningMessage("LogInFirst");
      return;
    }
    if (this.userDetails?.id === commentData?.author?.id) {
      this.showWarningMessage("CantLikeYourComment");
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
      this.showWarningMessage("AlreadyLikedComment");
      return;
    }

    this.groupService.updateGroupComment(this.event.id, commentData.id, commentData).subscribe(() => {
      this.messageDetails = '';
      this.showCommentSavedMessage();
      this.newComment();

    }, () => {

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
      let _replies = [];
      let data = {};
      if (!this.isReply) {
        commentData['rating'] = this.rating;
      }
      else {
        if (this.replies == null) {
          _replies.push(commentData);
        }
        else {

          this.replies.push(commentData);
          _replies = this.replies;

        }
        data["replies"] = _replies;
        this.updateCommentOnServer(this.commentedReply, data);
        return;
      }
      if (this.editedCommentId) {
        this.updateCommentOnServer(this.editedCommentId, commentData);
      } else {
        commentData['likes_count'] = 0;
        this.saveCommentOnServer(commentData);
      }

      const article = this.event;
      this.analyticsService.logEvent('group_comment', {
        group_id: article.id,
        group_title: article.group_name,
        // article_language: article.lang,
        // article_author_name: article.author.fullname,
        article_author_id: article.owner.id,
        article_category_title: article.group_type,
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
  setRate(rate: number) {
    this.rating = rate;
  }
  saveCommentOnServer(commentData) {
    this.isFormSaving = true;
    this.groupService.createGroupComment(this.event.id, commentData).subscribe(() => {

      this.messageDetails = '';
      this.showCommentSavedMessage();
      this.newComment();
      this.isFormSaving = false;
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
    this.groupService.updateGroupComment(this.event.id, editedCommentId, commentData).subscribe(() => {
      this.messageDetails = '';
      this.showCommentSavedMessage();
      this.newComment();
      this.isReply = false;
      this.isFormSaving = false;
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

  replyComment(commentId, commentData, replies) {
    this.replyMessage = commentData.message;
    this.isReply = true;
    this.commentedReply = commentId;
    this.replies = replies;
    this.scrollToEditCommentSection();
  }
  deleteComment(commentId: string) {
    this.isReportAbuseLoading = true;
    this.groupService.deleteGroupComment(this.event.id, commentId).subscribe(() => {
      this.isReportAbuseLoading = false;
    }, () => {
      this.showWarningMessage("CantDeleteComment");
    })
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
