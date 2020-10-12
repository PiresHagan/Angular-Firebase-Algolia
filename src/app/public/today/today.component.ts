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

  constructor(
    private articleService: ArticleService,
    public translate: TranslateService,
    private languageService: LanguageService
  ) { }
  switchLang(lang: string) {
    this.translate.use(lang);
  }
  ngOnInit(): void {
    this.selectedLanguage = this.languageService.getSelectedLanguage();
    this.articleService.getToday(this.selectedLanguage).subscribe(articles => {
      this.todayArticle = articles;
      console.log('Todays Articles', articles);
    });

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.selectedLanguage = this.languageService.getSelectedLanguage()

      this.articleService.getToday(this.selectedLanguage).subscribe(articles => {
        console.log('Todays Articles1', articles);
      });

    });
  }

}
