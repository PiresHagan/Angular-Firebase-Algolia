import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/shared/services/article.service';
import { Observable } from 'rxjs';
import { Article } from 'src/app/shared/interfaces/article.type';
import { TranslateService, LangChangeEvent } from "@ngx-translate/core";

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit {

  blogs = [];
  loading: boolean = true;
  loadingMore: boolean = false;
  articles: Article[];
  lastVisible: any = null;

  constructor(private articleService: ArticleService,
    public translate: TranslateService) { }


  ngOnInit() {
    window.addEventListener('scroll', this.scrollEvent, true);

    this.articleService.getArticles().subscribe((data) => {
      this.articles = data.articleList;
      this.lastVisible = data.lastVisible;
    });

    console.log('Articles', this.articles);

    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  scrollEvent = (event: any): void => {
    const top = event.target.documentElement.scrollTop
    const height = event.target.documentElement.scrollHeight
    const offset = event.target.documentElement.offsetHeight
    if (top > height - offset - 1 - 100 && this.lastVisible) {
      this.loadingMore = true;
      this.articleService.getArticles('', null, 'next', this.lastVisible).subscribe((data) => {
        this.loadingMore = false;
        this.articles = [...this.articles, ...data.articleList];
        this.lastVisible = data.lastVisible;
      });
    }
  }

}
