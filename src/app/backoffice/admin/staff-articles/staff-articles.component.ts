import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from "@ngx-translate/core";
import { AuthService } from 'src/app/shared/services/authentication.service';
import { StaffArticleService } from 'src/app/shared/services/staff-article.service';
import { Article } from 'src/app/shared/interfaces/article.type';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-article-list',
  templateUrl: './staff-articles.component.html',
  styleUrls: ['./staff-articles.component.scss']
})
export class StaffArticlesComponent implements OnInit {

  blogs = [];
  loading: boolean = true;
  loadingMore: boolean = false;
  articles: Article[];
  lastVisible: any = null;
  userDetails;
  searchSlug: string = ""
  notFound = false;

  constructor(
    public translate: TranslateService,
    public authService: AuthService,
    public articleService: StaffArticleService,
    public router: Router
  ) { }


  ngOnInit() {
    window.addEventListener('scroll', this.scrollEvent, true);
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;
      this.userDetails = await this.authService.getLoggedInUserDetails();
      if (this.userDetails) {
        this.articleService.getArticles(10).subscribe((data) => {
          this.articles = data.articleList;
          this.lastVisible = data.lastVisible;
          this.loading = false;
        });

      }

    })

  }

  scrollEvent = (event: any): void => {
    if (event.target && event.target.documentElement) {
      const top = event.target.documentElement.scrollTop
      const height = event.target.documentElement.scrollHeight
      const offset = event.target.documentElement.offsetHeight
      if (top > height - offset - 1 - 100 && this.lastVisible && !this.loadingMore) {
        this.loadingMore = true;
        this.articleService.getArticles(null, 'next', this.lastVisible).subscribe((data) => {
          this.loadingMore = false;
          this.articles = [...this.articles, ...data.articleList];
          this.lastVisible = data.lastVisible;
        });
      }
    }

  }
  replaceImage(url) {
    let latestURL = url
    if (url) {
      latestURL = latestURL.replace('https://mytrendingstories.com/', "https://assets.mytrendingstories.com/")
        .replace('https://cdn.mytrendingstories.com/', "https://assets.mytrendingstories.com/")
        .replace('https://abc2020new.com/', "https://assets.mytrendingstories.com/");
    }
    return latestURL;
  }
  getArticleSearchBySlug() {
    this.articleService.getArticalBySlug(this.searchSlug).subscribe((result) => {
      if (result && result[0])
        this.router.navigate(['app/article/compose'], { queryParams: { article: result[0].id } });
      else
        this.notFound = true;
    })

    console.log(this.searchSlug);
  }
}
