import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthorService } from 'src/app/shared/services/author.service';
import { ArticleService } from 'src/app/shared/services/article.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { UserService } from 'src/app/shared/services/user.service';

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

      this.authService.getAuthState().subscribe(user => {
        if (user && !user.isAnonymous) {
          this.isLoggedInUser = true;
          this.setUserDetails();
        } else {
          this.isLoggedInUser = false;
        }
      });

      this.authorService.getUserBySlug(slug).subscribe(author => {
        this.authorDetails = author;
        this.setFollowOrNot();
        this.getFollowersDetails(author["followers"]);
        this.getSubscribersDetails(author["subscribers"])
        this.getArticleList(author['id']);
      });
    });
  }
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
        this.setFollowOrNot();
        this.setFollowOrNot();
      })
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
      displayName: this.userDetails.displayName,
      slug: this.userDetails.slug ? this.authorDetails.slug : '',
      photoURL: this.userDetails.photoURL,
      uid: this.userDetails.uid,
    }
  }
  follow(authorId) {
    let userDetails = this.getUserDetails();
    let followerDetails = {
      displayName: userDetails.displayName,
      slug: userDetails.slug ? userDetails.slug : '',
      photoURL: userDetails.photoURL,
      id: userDetails.uid,
    }
    this.authorService.follow(authorId, this.getUserDetails());

  }

  unfollow(authorId) {
    this.authorService.unfollow(authorId, this.getUserDetails().uid);

  }
  setFollowOrNot() {

    this.authorService.isUserFollowing("4UoQgM8KGkYcWG6cELEvm26Gis63", this.getUserDetails().uid).subscribe((data) => {
      if (data) {
        this.isFollowing = true;
      } else {
        this.isFollowing = false;
      }
    });
  }

}
