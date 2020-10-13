import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthorService } from 'src/app/shared/services/author.service';
import { ArticleService } from 'src/app/shared/services/article.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { UserService } from 'src/app/shared/services/user.service';
import { environment } from 'src/environments/environment';
import { LanguageService } from 'src/app/shared/services/language.service';
import { Article } from 'src/app/shared/interfaces/article.type';
import { AUTHOR } from 'src/app/shared/constants/member-constant';
import { NzModalService } from 'ng-zorro-antd';
import {  Router } from '@angular/router';
import { SeoService } from 'src/app/shared/services/seo/seo.service';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  authorDetails: any = {};
  followers: any = [];
  subscribers: any = [];
  articles: any = [];
  isReportAbuseLoading: boolean = false;
  isLoggedInUser: boolean = false;
  isFollowing: boolean = false;
  userDetails;
  isLoaded: boolean = false;
  selectedLang: string;
  lastVisibleFollower;
  lastVisibleFollowing;
  loadingMoreFollowers: boolean = false;
  loadingMoreFollowings: boolean = false;
  lastArticleIndex;
  lastArticleIndexOfAudio;
  lastArticleIndexOfVideo;
  audioArticles: Article[] = [];
  videoArticles: Article[] = [];

  constructor(
    private route: ActivatedRoute,
    private authorService: AuthorService,
    private articleService: ArticleService,
    public translate: TranslateService,
    private authService: AuthService,
    public userService: UserService,
    public langService: LanguageService,
    private modal: NzModalService,
    private router: Router,
    private seoService: SeoService,
    private analyticsService: AnalyticsService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {

      const slug = params.get('slug');
      if (slug == 'undefined')
        return;

      this.authorService.getUserBySlug(slug).subscribe(author => {
        this.authorDetails = author;
        this.followers = [];
        this.subscribers = [];
        this.getFollowersDetails();
        this.getFollowingDetails();
        this.getArticleList(author['id']);
        this.setUserDetails();

        this.seoService.updateMetaTags({
          title: this.authorDetails.fullname,
          description: this.authorDetails[`biography_${this.authorDetails?.lang}`]?.substring(0, 154),
          keywords: this.authorDetails.fullname,
          summary: this.authorDetails[`biography_${this.authorDetails?.lang}`],
          type: this.authorDetails?.type,
          image: { url: this.authorDetails?.avatar?.url }
        });
      });
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
      if (!this.userDetails) {
        this.userDetails = null;
        this.isLoggedInUser = false;
      } else {
        this.setFollowOrNot();
        this.isLoggedInUser = true;
      }
    })
  }

  getFollowersDetails() {
    // this.authorService.getFollowers(this.authorDetails.id).subscribe((followers) => {
    //   this.followers = followers;
    // })
    this.authorService.getFollowers_new(this.authorDetails.id, 14, null, this.lastVisibleFollower).subscribe((data) => {
      this.loadingMoreFollowers = false;

      this.followers = data.followers;

      this.lastVisibleFollower = data.lastVisible;
    });
  }
  getFollowingDetails() {
    // this.authorService.getFollowings(this.authorDetails.id).subscribe((following) => {
    //   this.subscribers = following;
    // })
    this.loadingMoreFollowings = true;
    this.authorService.getFollowings_new(this.authorDetails.id, 14, null, this.lastVisibleFollower).subscribe((data) => {
      this.loadingMoreFollowings = false;
      this.subscribers = data.followings
      this.lastVisibleFollowing = data.lastVisible;
    });
  }
  getArticleList(authorId) {
    this.articleService.getArticlesByAuthor(authorId, 12).subscribe((articleData) => {
      this.articles = articleData.articleList;
      this.lastArticleIndex = articleData.lastVisible;
    })
  }
  loadMoreArticle() {
    const authorId = this.authorDetails.id;
    this.articleService.getArticlesByAuthor(authorId, 12, 'next', this.lastArticleIndex).subscribe((articleData) => {
      let mergedData: any = [...this.articles, ...articleData.articleList];
      this.articles = this.getDistinctArray(mergedData)
      this.lastArticleIndex = articleData.lastVisible;
    })
  }
  reportAbuseAuthor() {
    this.isReportAbuseLoading = true;
    this.authorService.reportAbusedUser(this.authorDetails.id).then(() => {
      this.showAbuseSuccessMessage();
      this.isReportAbuseLoading = false;
    }).catch(() => {
      this.isReportAbuseLoading = false;
    })
  }
  showAbuseSuccessMessage() {

    this.modal.success({
      nzTitle: this.translate.instant('Report'),
      nzContent: this.translate.instant('ReportMessage')
    });
  }
  getUserDetails() {
    return {
      fullname: this.userDetails.fullname,
      slug: this.userDetails.slug ? this.userDetails.slug : '',
      avatar: this.userDetails.avatar ? this.userDetails.avatar : '',
      id: this.userDetails.id,
      type: this.userDetails.type ? this.userDetails.type : AUTHOR
    }
  }
  getAuthorDetails() {
    return {
      fullname: this.authorDetails.fullname,
      slug: this.authorDetails.slug ? this.authorDetails.slug : '',
      avatar: this.authorDetails.avatar ? this.authorDetails.avatar : '',
      id: this.authorDetails.id,
    }
  }
  async follow(authorId) {
    if(this.authorDetails.id){
    const userDetails = this.getUserDetails();
    const authorDetails = this.getAuthorDetails();
    if (userDetails.id == authorId) {
      this.showSameFollowerMessage();
      return;
    }

    await this.authorService.follow(authorId, userDetails.type);

    this.analyticsService.logEvent("follow_author", {
      author_id: authorDetails.id,
      author_name: authorDetails.fullname,
      user_uid: userDetails.id,
      user_name: userDetails.fullname,
    });
  }else{
    this.showModal();
  }
  }
  showSameFollowerMessage() {
    this.modal.warning({
      nzTitle: this.translate.instant('FollowNotAllowed'),
      nzContent: this.translate.instant('FollowNotAllowedMessage')
    });
  }

  async unfollow(authorId) {
    if(this.authorDetails.id){
    const userDetails = this.getUserDetails();
    const authorDetails = this.getAuthorDetails();
    await this.authorService.unfollow(authorId, userDetails.type);

    this.analyticsService.logEvent("unfollow_author", {
      author_id: authorDetails.id,
      author_name: authorDetails.fullname,
      user_uid: userDetails.id,
      user_name: userDetails.fullname,
    });
  }else{
    this.showModal();
  }
  }
  setFollowOrNot() {

    this.authorService.isUserFollowing(this.authorDetails.id, this.getUserDetails().id).subscribe((data) => {
      if (data) {
        this.isFollowing = true;
      } else {
        this.isFollowing = false;
      }
    });
  }
  public loadScript() {

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
  loadMoreFollowers(action = "next") {
    this.loadingMoreFollowers = true;
    this.authorService.getFollowers_new(this.authorDetails.id, 14, action, this.lastVisibleFollower).subscribe((data) => {
      this.loadingMoreFollowers = false;
      let mergedData: any = [...this.followers, ...data.followers]
      this.followers = this.getDistinctArray(mergedData)

      this.lastVisibleFollower = data.lastVisible;
    });
  }
  loadMoreFollowings(action = "next") {
    this.loadingMoreFollowings = true;
    this.authorService.getFollowings_new(this.authorDetails.id, 14, action, this.lastVisibleFollowing).subscribe((data) => {
      this.loadingMoreFollowings = false;
      let mergedData: any = [...this.subscribers, ...data.followings];
      this.subscribers = this.getDistinctArray(mergedData)
      this.lastVisibleFollowing = data.lastVisible;
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
  getDistinctArray(data) {
    var resArr = [];
    data.filter(function (item) {
      var i = resArr.findIndex(x => x.id == item.id);
      if (i <= -1) {
        resArr.push(item);
      }
      return null;
    });
    return resArr;
  }
  getAudioArticles() {
    if (this.audioArticles.length != 0)
      return;
    const authorId = this.authorDetails.id;
    this.articleService.getArticlesByAuthor(authorId, 12, 'first', null, 'audio').subscribe((articleData) => {
      this.audioArticles = articleData.articleList;
      this.lastArticleIndexOfAudio = articleData.lastVisible;
    })
  }
  getVideoArticles() {
    if (this.videoArticles.length != 0)
      return;
    const authorId = this.authorDetails.id;
    this.articleService.getArticlesByAuthor(authorId, 12, 'first', null, 'video').subscribe((articleData) => {
      this.videoArticles = articleData.articleList;
      this.lastArticleIndexOfVideo = articleData.lastVisible;
    })
  }
  loadMoreAudioArticles() {
    const authorId = this.authorDetails.id;
    this.articleService.getArticlesByAuthor(authorId, 12, 'next', this.lastArticleIndexOfAudio, 'audio').subscribe((articleData) => {
      let mergedData: any = [...this.audioArticles, ...articleData.articleList];
      this.audioArticles = this.getDistinctArray(mergedData)
      this.lastArticleIndexOfAudio = articleData.lastVisible;
    })
  }

  loadMoreVideoArticles() {
    const authorId = this.authorDetails.id;
    this.articleService.getArticlesByAuthor(authorId, 12, 'next', this.lastArticleIndexOfVideo, 'video').subscribe((articleData) => {
      let mergedData: any = [...this.videoArticles, ...articleData.articleList];
      this.videoArticles = this.getDistinctArray(mergedData)
      this.lastArticleIndexOfVideo = articleData.lastVisible;
    })
  }

  isVisible = false;
  isOkLoading = false;
  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.router.navigate(["auth/login"]);
      this.isOkLoading = false;
    }, 2000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

}
