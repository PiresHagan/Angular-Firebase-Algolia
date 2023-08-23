import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService, NzScrollService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/shared/services/language.service';
import { SeoService } from 'src/app/shared/services/seo/seo.service';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { User } from 'src/app/shared/interfaces/user.type';import { EventHostConstant } from 'src/app/shared/constants/event-host-constants';
import { EventsService } from 'src/app/shared/services/events.services';
import { Event } from 'src/app/shared/interfaces/event.type';
import { AuthorService } from 'src/app/shared/services/author.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { HOSTEVENT } from 'src/app/shared/constants/member-constant';


@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {

  event: Event;
  isLoggedInUser: boolean = false;
  userDetails: User;
  host;
  isFollowing: boolean = false;
  isLike: boolean = false;
  isAbused: boolean = false;
  lastVisibleFollower;
  followers=[];
  searchOptions=[];
  similarEventsList=[];
  lastEventDoc;
  event_status;
  canBook : boolean=false;
  isVisible = true;
  articleLikes: number = 0;
  articleVicewCount: number = 0;
  isVisibleMiddle = false;
  isShareVisibleMiddle = true;
  showShare = false;
  isReportAbuseArticleLoading=false;
  constructor(
    private route: ActivatedRoute,
    public translate: TranslateService,
    private languageService: LanguageService,
    private seoService: SeoService,
    private analyticsService: AnalyticsService,
    public authService: AuthService,
    public eventsService: EventsService,
    private router: Router,
    private modal: NzModalService,
    public authorService: AuthorService,

  ) { }

  ngOnInit(): void {
    this.setUserDetails();
    this.route.paramMap.subscribe(params => {
      const eventType = params.get('eventType')
      const slug = params.get('eventslug');
      this.eventsService.getEventsBySlug(eventType,slug).subscribe(event => {
        this.event = event[0];
        if (!this.event )
       { 
        this.modal.error({
        nzTitle: this.translate.instant('URL404'),
        nzContent: this.translate.instant('URLNotFound'),
        nzOnOk: () => this.router.navigate(['/'])
      });
         return;
        }
      this.event_status= this.event.status.title;
      const currentdate = new Date();
      const scheduleDate = new Date(this.event.scheduled_date);
      if(currentdate.getTime()<scheduleDate.getTime()){
        if(this.event.first_joind_group==undefined || this.event.second_joind_group==undefined){
          this.canBook=true;
        }
      }
      this.eventsService.updateViewCount(this.event.id);
      // get all events of eventType
      this.getHostDetails();
      this.articleLikes = this.event.likes_count;
      this.articleVicewCount = this.event.view_count;
      this.eventsService.getSimilarEventsByType(7,'',null,this.event.event_type,this.event.id).subscribe(({ articleList, lastVisible }) => {
        this.similarEventsList = articleList
        this.lastEventDoc = lastVisible;
      })
      });  
  });
  }
  FillSerachOptions(){
    // get locations array
    
  }
  getFollowersDetails() {
    // this.authorService.getFollowers(this.authorDetails.id).subscribe((followers) => {
    //   this.followers = followers;
    // })
    this.authorService.getFollowers_new(this.host.id, 8, 'first', this.lastVisibleFollower).subscribe((data) => {
      
      this.followers = data.followers;

      this.lastVisibleFollower = data.lastVisible;
    });
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
        this.getUserDetails();
        this.setFollowOrNot();
        this.setLike();
        this.setAbused();
      } else {
        this.userDetails = null;
        this.isLoggedInUser = false;
      }



    })
}
getHostDetails(){
  this.authorService.getAuthorById(this.event.owner.id).subscribe(host=>{
    this.host=host[0];
    this.getFollowersDetails();
  });
}
setFollowOrNot() {
  this.authorService.isUserFollowing(this.event.publisher.id, this.getUserDetails().id, this.event.publisher.type).subscribe((data) => {
    if (data) {
      this.isFollowing = true;
    } else {
      this.isFollowing = false;
    }
  });
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
SlideRelatedArticle: boolean = false;
slideArticle() {
  this.SlideRelatedArticle = !this.SlideRelatedArticle;
}
getRelativeDate(date: string) {
  return moment(date).fromNow();
}
//#region 
like() {
  if (this.isLoggedInUser) {
      this.eventsService.like(this.event.id, this.getUserDetails());

      this.eventsService.getEventById(this.event.id).subscribe(event => {
        this.event = event;
      });
        const event = this.event;
        this.analyticsService.logEvent('liked_hostevent', {
        event_id: event.id,
        event_title: event.event_name,
        event_author_id: event.owner.id,
        event_category_title: event.event_type,
        liked_by_user_name: this.getUserDetails().fullname,
        liked_by_user_id: this.getUserDetails().id,
      });
    
    
    
  } else {
    this.showModal();
  }
}
showModal(): void {
  this.isVisible = true;
}
disLike() {
  if (this.isLoggedInUser) {
    this.eventsService.disLike(this.event.id, this.getUserDetails().id);
    this.eventsService.getEventById(this.event.id).subscribe(event => {
      this.event = event;
    });
    const event = this.event;
    this.analyticsService.logEvent('unliked_hostevent', {
      event_id: event.id,
      event_title: event.event_name,
      event_author_id: event.owner.id,
      article_category_title: event.event_type,
      unliked_by_user_name: this.getUserDetails().fullname,
      unliked_by_user_id: this.getUserDetails().id,
    });
    
  } else {
    this.showModal();
  }
}
setLike() {
  this.eventsService.isLikedByUser(this.event.id, this.getUserDetails().id).subscribe((data) => {
    if (data) {
      this.isLike = true;
    } else {
      this.isLike = false;
    }
  });
}
setAbused(){
  this.eventsService.isAbusedByUser(this.event.id, this.getUserDetails().id).subscribe((data) => {
    if (data) {
      this.isAbused = true;
    } else {
      this.isAbused = false;
    }
  });
}
follow() {
  this.handleOkMiddle()
  if (this.isLoggedInUser) {
    const userDetails = this.getUserDetails();
    if (userDetails.id == this.event.owner.id) {
      this.showSameFollowerMessage();
      return;
    }
    this.authorService.follow(this.event.owner.id, HOSTEVENT);
    this.analyticsService.logEvent("follow_hostevent", {
      author_id: this.event.owner.id,
      user_uid: userDetails.id,
      user_name: userDetails.fullname,
    });
  } else {
    this.showModal();
  }
}
unfollow() {
 // this.handleOkMiddle()
  if (this.isLoggedInUser) {
    this.authorService.unfollow(this.event.owner.id, HOSTEVENT);
    const userDetails = this.getUserDetails();

    this.analyticsService.logEvent("unfollow_hostevent", {
      author_id: this.event.owner.id,
      user_uid: userDetails.id,
      user_name: userDetails.fullname,
    });
  } else {
    this.showModal();
  }
}
handleOkMiddle(): void {

   this.isVisibleMiddle = false;
}
showSameFollowerMessage() {
  this.modal.warning({
    nzTitle: this.translate.instant('FollowNotAllowed'),
    nzContent: this.translate.instant('FollowNotAllowedMessage')
  });
}
reportAbuseEvent() {
  this.isReportAbuseArticleLoading = true;
  this.eventsService.updateEventAbuse(this.event.id, this.userDetails).subscribe(() => { 
    this.isReportAbuseArticleLoading = false;
    this.showAbuseSuccessMessage();
    this.isAbused = true;
  });
  
}
showAbuseSuccessMessage() {

  this.modal.success({
    nzTitle: this.translate.instant('Report'),
    nzContent: this.translate.instant('ReportMessage')
  });
}
//#endregion
}
