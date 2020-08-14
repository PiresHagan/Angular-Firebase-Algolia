import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../../interfaces/article.type';
import { ArticleService } from 'src/app/shared/services/article.service';
import { LanguageService } from 'src/app/shared/services/language.service';
@Component({
  selector: 'app-home-article',
  templateUrl: './home-article.component.html',
  styleUrls: ['./home-article.component.scss']
})
export class HomeArticleComponent implements OnInit {
  @Input() article: Article;
  heroArticles: any;
  selectedLanguage: string = "";
  constructor(
    private articleService: ArticleService,
    private languageService: LanguageService,
  ) { }

  ngOnInit(): void {
    this.selectedLanguage = this.languageService.getSelectedLanguage();
    this.articleService.getHeroArticles(this.selectedLanguage).subscribe(articles => {
      this.heroArticles = articles;
    });
  
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
}
