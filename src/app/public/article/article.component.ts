import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from 'src/app/shared/services/article.service';
import { Article } from 'src/app/shared/interfaces/article.type';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ThemeConstantService } from 'src/app/shared/services/theme-constant.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/shared/services/user.service';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { User } from 'src/app/shared/interfaces/user.type';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ArticleComponent implements OnInit {
  @Output() change = new EventEmitter();
  @Input() lang: string;

  article: Article;
  articleLikes: number = 0;
  slug: string;
  articleComments: any;
  commentForm: FormGroup;
  isFormSaving: boolean = false;
  isCommentSavedSuccessfully: boolean = false;
  isLoggedInUser: boolean = false;
  isCommentsLoading: boolean = false;
  editedCommentId: string;
  lastCommentDoc: any;
  userDetails: User;
  messageDetails: string;
  status: boolean;
  replyMessage: string;
  activeComment: Comment;
  isReportAbuseLoading: boolean = false;
  @ViewChild('commentSection') private myScrollContainer: ElementRef;
  @ViewChild('commentReplySection') private commentReplyContainer: ElementRef;

  constructor(
    private articleService: ArticleService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public translate: TranslateService,
    private themeService: ThemeConstantService,
    public authService: AuthService,
    public userService: UserService,
    private sanitizer: DomSanitizer
  ) {
    translate.addLangs(['en', 'nl']);
    translate.setDefaultLang('en');
  }
  switchLang(lang: string) {
    this.translate.use(lang);
  }
  likeArticle() {
    if (this.articleLikes == 0)
      this.articleLikes++;
    else
      this.articleLikes--;
    this.status = !this.status;
  }

  ngOnInit(): void {
    this.themeService.selectedLang.subscribe(lang => this.switchLang(lang));

    this.route.paramMap.subscribe(params => {

      const slug = params.get('slug');
      this.articleService.getArtical(slug).subscribe(artical => {
        this.article = artical[0];
        const articleId = this.article.id;
        this.articleService.getArticalLikes(articleId).subscribe(likes => {
          this.articleLikes = likes;
        })
        this.getArticleComments(this.article.uid);
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
      this.lastCommentDoc = lastCommentDoc
    })
  }

  /**
   * Set user params 
   */
  setUserDetails() {
    this.authService.getAuthState().subscribe(user => {
      if (user && !user.isAnonymous) {
        this.isLoggedInUser = true;
      } else {
        this.userDetails = null;
        this.isLoggedInUser = false;
      }
    });
    this.userService.getCurrentUser().then((user) => {
      this.userService.get(user.uid).subscribe((userDetails) => {
        this.userDetails = userDetails;
      })
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
        published_on: this.activeComment ? this.activeComment['published_on'] : new Date(),
        updated_on: new Date(),
        repliedOn: this.activeComment ? this.activeComment['repliedOn'] : (this.replyMessage ? this.replyMessage : ''),
        message: this.messageDetails,
        user_details: {
          displayName: this.userDetails.displayName,
          slug: this.userDetails.slug ? this.userDetails.slug : '',
          photoURL: this.userDetails.photoURL,
          uid: this.userDetails.uid,
        }

      };
      if (this.editedCommentId) {
        this.updateCommentOnServer(this.editedCommentId, commentData);
      } else {
        this.saveCommentOnServer(commentData);
      }


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
    this.articleService.createComment(this.article.uid, commentData).then(() => {
      this.isFormSaving = false;
      this.messageDetails = '';
      this.showCommentSavedMessage();
      this.newComment();
    }).catch((e) => {
      console.log(e)
      this.isFormSaving = false;
    })
  }

  editComment(commentUid: string, commentData) {
    this.activeComment = commentData;
    this.editedCommentId = commentUid;
    this.messageDetails = commentData.message;
    this.replyMessage = '';
    this.scrollToEditCommentSection();
  }

  updateCommentOnServer(editedCommentId, commentData) {
    this.editedCommentId = '';

    this.articleService.updateComment(this.article.uid, editedCommentId, commentData).then(() => {
      this.isFormSaving = false;
      this.messageDetails = '';
      this.showCommentSavedMessage();
      this.newComment();

    }).catch((e) => {
      console.log(e)
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
    this.articleService.getArticleCommentNextPage(this.article.uid, 5, this.lastCommentDoc).subscribe(({ commentList, lastCommentDoc }) => {
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

  replyComment(commentUid: string, commentData) {
    this.replyMessage = commentData.message;
    this.scrollToEditCommentSection();
  }
  transformHtml(htmlTextWithStyle) {
    return this.sanitizer.bypassSecurityTrustHtml(htmlTextWithStyle);
  }
  updateArticleAbuse() {
    this.articleService.updateArticleAbuse(this.article.uid).then(() => {
      console.log('Your suggestion saved successfully.')
    })
  }
  reportAbuseComment(commentUid) {
    this.isReportAbuseLoading = true;
    this.articleService.updateArticleCommentAbuse(this.article.uid, commentUid).then(() => {
      this.isReportAbuseLoading = false;
      console.log('Your suggestion saved successfully.')
    })
  }

}
