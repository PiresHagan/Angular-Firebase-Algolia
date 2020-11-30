import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/shared/interfaces/article.type';
import { TranslateService, LangChangeEvent } from "@ngx-translate/core";
import { AuthService } from 'src/app/shared/services/authentication.service';
import { NzModalService, NzMessageService } from "ng-zorro-antd";
import { BackofficeArticleService } from '../../shared/services/backoffice-article.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-company-article',
  templateUrl: './company-article.component.html',
  styleUrls: ['./company-article.component.scss']
})
export class CompanyArticleComponent implements OnInit {

  blogs = [];
  loading: boolean = true;
  loadingMore: boolean = false;
  articles: Article[];
  lastVisible: any = null;
  userDetails;

  constructor(
    public translate: TranslateService,
    public authService: AuthService,
    public articleService: BackofficeArticleService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private activatedRoute: ActivatedRoute
  ) { }


  ngOnInit() {
    window.addEventListener('scroll', this.scrollEvent, true);
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;
      let authorId = this.activatedRoute.snapshot.queryParams["company"];
      if (!authorId)
        return;
      this.articleService.getArticlesByUser(authorId).subscribe((data) => {
        this.articles = data.articleList;
        this.lastVisible = data.lastVisible;
        this.loading = false;
      });
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
        this.articleService.getArticlesByUser(this.userDetails.id, null, 'next', this.lastVisible).subscribe((data) => {
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
        .replace('http://cdn.mytrendingstories.com/', "https://cdn.mytrendingstories.com/")
        .replace('https://abc2020new.com/', "https://assets.mytrendingstories.com/");
    }
    return latestURL;
  }

  deleteArticle(articleId: string) {
    let articleMessageConf = this.translate.instant("articleDeletMsgConf");
    let articleMessageSucc = this.translate.instant("articleDeletMsgSuc");
    this.modalService.confirm({
      nzTitle: "<i>" + articleMessageConf + "</i>",
      nzOnOk: () => {
        this.articleService.deleteArticle(articleId).subscribe(() => {
          this.modalService.success({
            nzTitle: "<i>" + articleMessageSucc + "</i>",
          });
        }, error => {
          this.modalService.error({
            nzTitle: "<i>" + this.translate.instant("SomethingWrong") + "</i>",
          });
        })
      },
    });

  }


}
