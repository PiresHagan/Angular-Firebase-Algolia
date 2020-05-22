import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/shared/services/article.service';
import { Observable } from 'rxjs';
import { Article } from 'src/app/shared/interfaces/article.type';
declare var require: any

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit {

  blogs = [];
  loading = true;
  articles: Observable<Article[]>;

  constructor(private articleService: ArticleService) { }

  ngOnInit() {

    this.articles = this.articleService.getAll();

    console.log('Articles', this.articles);

    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

}
