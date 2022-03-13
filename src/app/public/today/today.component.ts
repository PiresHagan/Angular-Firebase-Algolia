import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/shared/services/language.service';
import { ArticleService } from 'src/app/shared/services/article.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.scss']
})
export class TodayComponent implements OnInit {
  selectedLanguage: string = "";
  todayArticle: any[];
  trendingArticles: any[];
  todayArticles: any[];
  total: any;
  paginatedItems: any[];
  total_pages: any;
  constructor(
    private articleService: ArticleService,
    public translate: TranslateService,
    private languageService: LanguageService
  ) { }
  switchLang(lang: string) {
    this.translate.use(lang);
  }
  ngOnInit(): void {
    // this.selectedLanguage = this.languageService.getSelectedLanguage();
    // this.articleService.getToday(this.selectedLanguage).subscribe(articles => {
    //   //this.todayArticle = articles;
    //   // console.log('Todays Articles', articles);
    // });

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.selectedLanguage = this.languageService.getSelectedLanguage()

      this.articleService.getToday(this.selectedLanguage).subscribe(articles => {
        // console.log('Todays Articles1', articles);
      });

    });

    this.onIndexChange(1);
  }

  onIndexChange(value: number){ 
    this.selectedLanguage = this.languageService.getSelectedLanguage();
    
    this.articleService.getToday(this.selectedLanguage).subscribe(articles => {
      this.todayArticles = articles;
      this.total = articles.length;

      const per_page = 30;
      const start = (value - 1) * per_page;
      const end = value * per_page;
      this.todayArticle = this.todayArticles.slice(start, end);
      this.total_pages = Math.ceil(this.total / per_page);
      this.total_pages = this.total_pages * 10;
      console.log('total_pages', this.total_pages)
      console.log('paginatedItems', this.trendingArticles)
    });
    
  }

}
