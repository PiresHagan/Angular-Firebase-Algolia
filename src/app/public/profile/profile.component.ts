import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthorService } from 'src/app/shared/services/author.service';
import { ArticleService } from 'src/app/shared/services/article.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { UserService } from 'src/app/shared/services/user.service';
import { environment } from 'src/environments/environment';

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
  constructor(
    private route: ActivatedRoute,
    private authorService: AuthorService,
    private articleService: ArticleService,
    public translate: TranslateService,
    private authService: AuthService,
    public userService: UserService,
  ) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {

      const slug = params.get('slug');

      this.authorService.getUserBySlug(slug).subscribe(author => {
        this.authorDetails = author;
        this.getFollowersDetails(author["followers"]);
        this.getSubscribersDetails(author["subscribers"])
        this.getArticleList(author['id']);
        this.setUserDetails();
        this.loadScript();
      });
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
      } else {
        this.userDetails = null;
        this.isLoggedInUser = true;
      }

      this.userDetails = await this.authService.getLoggedInUserDetails();
      this.setFollowOrNot();


    })
  }


  getFollowersDetails(followerList) {
    this.authorService.getAuthorsById(followerList).subscribe((followers) => {
      this.followers = followers;
    })
  }
  getSubscribersDetails(subscriberList) {
    this.authorService.getAuthorsById(subscriberList).subscribe((subscribers) => {
      this.subscribers = subscribers;
    })
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
  follow(authorId) {
    let userDetails = this.getUserDetails();
    this.authorService.follow(authorId, userDetails);

  }

  unfollow(authorId) {
    this.authorService.unfollow(authorId, this.getUserDetails().id);

  }
  setFollowOrNot() {

    this.authorService.isUserFollowing("4UoQgM8KGkYcWG6cELEvm26Gis63", this.getUserDetails().id).subscribe((data) => {
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


}
