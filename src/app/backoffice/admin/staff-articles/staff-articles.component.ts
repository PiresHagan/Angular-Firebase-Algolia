import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { Article } from 'src/app/shared/interfaces/article.type';
import { Router, ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { CommonBackofficeService } from '../../shared/services/common-backoffice.service';
import { BackofficeArticleService } from '../../shared/services/backoffice-article.service';

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
  searchSlug: string = '';
  articleTitle: string = '';
  notFound = false;
  oldArtilceList: Article[];

  constructor(
    public translate: TranslateService,
    public authService: AuthService,
    public commonService: CommonBackofficeService,
    public router: Router,
    private articleService: BackofficeArticleService,
    private modalService: NzModalService

  ) { }


  ngOnInit() {
    window.addEventListener('scroll', this.scrollEvent, true);
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;
      this.userDetails = await this.authService.getLoggedInUserDetails();
      if (this.userDetails) {
        this.commonService.getArticles(10).subscribe((data) => {
          this.articles = data.articleList;
          this.lastVisible = data.lastVisible;
          this.loading = false;
        });

      }

    })

  }

  scrollEvent = (event: any): void => {
    let documentElement = event.target.documentElement ? event.target.documentElement : event.target;
    if (documentElement) {
      const top = documentElement.scrollTop
      const height = documentElement.scrollHeight
      const offset = documentElement.offsetHeight
      if (top > height - offset - 1 - 100 && this.lastVisible && !this.loadingMore) {
        this.loadingMore = true;
        this.commonService.getArticles(null, 'next', this.lastVisible).subscribe((data) => {
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
      latestURL = latestURL.replace('https://mytrendingstories.com/', 'https://assets.mytrendingstories.com/')
        .replace('http://cdn.mytrendingstories.com/', 'https://cdn.mytrendingstories.com/')
        .replace('https://abc2020new.com/', 'https://assets.mytrendingstories.com/');
    }
    return latestURL;
  }
  getArticle() {
    let searchKey;
    let searchValue;
    if (this.searchSlug) {
      this.articleTitle = '';
      searchKey = 'slug';
      searchValue = decodeURIComponent(this.searchSlug);

    }
    if (this.articleTitle) {
      this.searchSlug = '';
      searchKey = 'title';
      searchValue = this.articleTitle;
    }

    this.commonService.getArticle(searchKey, searchValue).subscribe((result) => {
      if (result && result[0])
        this.articles = result
      else
        this.notFound = true;
      setTimeout(() => {
        this.notFound = false;
      }, 1000)
    })
  }
  deleteArticle(articleId: string) {
    let articleMessageConf = this.translate.instant('articleDeletMsgConf');
    let articleMessageSucc = this.translate.instant('articleDeletMsgSuc');
    this.modalService.confirm({
      nzTitle: '<i>' + articleMessageConf + '</i>',
      nzOnOk: () => {
        this.articleService.deleteArticle(articleId).subscribe(() => {
          this.modalService.success({
            nzTitle: '<i>' + articleMessageSucc + '</i>',
          });
        })
      },
    });


  }
  resetSearch() {
    this.searchSlug = '';
    this.articleTitle = '';
    this.articleService.getArticles(10).subscribe((data) => {
      this.articles = data.articleList;
      this.lastVisible = data.lastVisible;
      this.loading = false;
    });
  }
}
