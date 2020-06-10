import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthorService } from 'src/app/shared/services/author.service';
import { ArticleService } from 'src/app/shared/services/article.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { UserService } from 'src/app/shared/services/user.service';
import { environment } from 'src/environments/environment';
import { Meta, Title } from '@angular/platform-browser';
import { LanguageService } from 'src/app/shared/services/language.service';

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
  constructor(
    private titleService: Title,
    private metaTagService: Meta,
    private route: ActivatedRoute,
    private authorService: AuthorService,
    private articleService: ArticleService,
    public translate: TranslateService,
    private authService: AuthService,
    public userService: UserService,
    public langService: LanguageService
  ) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {

      const slug = params.get('slug');

      this.authorService.getUserBySlug(slug).subscribe(author => {
        this.authorDetails = author;
        this.followers = [];
        this.subscribers = [];
        this.getFollowersDetails();
        this.getFollowingDetails();
        this.getArticleList(author['id']);
        this.setUserDetails();

        this.titleService.setTitle(`${this.authorDetails.fullname}`);

        this.metaTagService.addTags([
          { name: "description", content: `${this.authorDetails[`biography_${this.authorDetails?.lang}`]?.substring(0, 154)}` },
          { name: "keywords", content: `${this.authorDetails?.fullname}` },
          { name: "twitter:card", content: `${this.authorDetails[`biography_${this.authorDetails?.lang}`]}` },
          { name: "og:title", content: `${this.authorDetails.fullname}` },
          { name: "og:type", content: `${this.authorDetails?.type}` },
          { name: "og:url", content: `${window.location?.href}` },
          { name: "og:image", content: `${this.authorDetails?.avatar?.url}` },
          { name: "og:description", content: `${this.authorDetails[`biography_${this.authorDetails?.lang}`]}` }
        ]);
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
    this.authorService.getFollowers_new(this.authorDetails.id, 10, null, this.lastVisibleFollower).subscribe((data) => {
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
    this.authorService.getFollowings_new(this.authorDetails.id, 10, null, this.lastVisibleFollower).subscribe((data) => {
      this.loadingMoreFollowings = false;
      this.subscribers = data.followings
      this.lastVisibleFollowing = data.lastVisible;
    });
  }
  getArticleList(authorId) {
    this.articleService.getArticlesByAuthor(authorId).subscribe((articleList) => {
      console.log(articleList);
      this.articles = articleList;
    })
  }
  reportAbuseAuthor() {
    this.isReportAbuseLoading = true;
    this.authorService.reportAbusedUser(this.authorDetails.id).then(() => {
      this.isReportAbuseLoading = false;
    }).catch(() => {
      this.isReportAbuseLoading = false;
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
  getAuthorDetails() {
    return {
      fullname: this.authorDetails.fullname,
      slug: this.authorDetails.slug ? this.authorDetails.slug : '',
      avatar: this.authorDetails.avatar ? this.authorDetails.avatar : '',
      id: this.authorDetails.id,
    }
  }
  async follow(authorId) {
    let userDetails = this.getUserDetails();
    let authorDetails = this.getAuthorDetails();
    await this.authorService.follow(authorId, userDetails);
    await this.authorService.following(userDetails.id, authorDetails);
    this.authorService.followCount(authorId, userDetails.id, 1);

  }

  async unfollow(authorId) {
    await this.authorService.unfollow(authorId, this.getUserDetails().id);
    await this.authorService.unfollowing(this.getUserDetails().id, authorId);
    this.authorService.followCount(authorId, this.getUserDetails().id, -1);
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
    this.authorService.getFollowers_new(this.authorDetails.id, 10, action, this.lastVisibleFollower).subscribe((data) => {
      this.loadingMoreFollowers = false;
      let mergedData: any = [...this.followers, ...data.followers]
      this.followers = this.getDistinctArray(mergedData)

      this.lastVisibleFollower = data.lastVisible;
    });
  }
  loadMoreFollowings(action = "next") {
    this.loadingMoreFollowings = true;
    this.authorService.getFollowings_new(this.authorDetails.id, 10, action, this.lastVisibleFollowing).subscribe((data) => {
      this.loadingMoreFollowings = false;
      let mergedData: any = [...this.subscribers, ...data.followings];
      this.subscribers = this.getDistinctArray(mergedData)
      this.lastVisibleFollowing = data.lastVisible;
    });
  }
  replaceImage(url) {
    let latestURL = url
    if (url) {
      latestURL = latestURL.replace('https://mytrendingstories.com/', "http://assets.mytrendingstories.com/");
      latestURL = latestURL.replace('https://cdn.mytrendingstories.com/', "http://assets.mytrendingstories.com/");
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
}
