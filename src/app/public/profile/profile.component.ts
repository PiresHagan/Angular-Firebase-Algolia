import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthorService } from 'src/app/shared/services/author.service';
import { ArticleService } from 'src/app/shared/services/article.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/services/authentication.service';

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
  constructor(
    private route: ActivatedRoute,
    private authorService: AuthorService,
    private articleService: ArticleService,
    public translate: TranslateService,
    private authService: AuthService,
  ) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {

      const slug = params.get('slug');

      this.authService.getAuthState().subscribe(user => {
        if (user && !user.isAnonymous) {
          this.isLoggedInUser = true;
        } else {
          this.isLoggedInUser = false;
        }
      });

      this.authorService.getUserBySlug(slug).subscribe(author => {
        this.authorDetails = author;
        this.getFollowersDetails(author["followers"]);
        this.getSubscribersDetails(author["subscribers"])
        this.getArticleList(author['id']);
      });
    });
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

}
