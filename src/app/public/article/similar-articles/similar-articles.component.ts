import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

import { Article } from 'src/app/shared/interfaces/article.type';
import { ArticleService } from 'src/app/shared/services/article.service';
import { LanguageService } from 'src/app/shared/services/language.service';

@Component({
  selector: 'app-similar-articles',
  templateUrl: './similar-articles.component.html',
  styleUrls: ['./similar-articles.component.scss']
})
export class SimilarArticlesComponent implements OnInit {

  @Input() article: Article
  similarArticleList;
  selectedLanguage: string = "";

  constructor(
    private articleService: ArticleService,
    private langService: LanguageService
  ) { }

  ngOnInit(): void {
    this.selectedLanguage = this.langService.getSelectedLanguage();

    this.similarArticleList = this.articleService.getCategoryRow(
      this.article.category.slug,
      this.selectedLanguage,
      7,
      this.article.slug,
    );
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

  getRelativeDate(date: string) {
    return moment(date).fromNow();
  }

}
