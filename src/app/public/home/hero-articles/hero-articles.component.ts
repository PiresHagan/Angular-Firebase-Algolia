import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { CacheService } from 'src/app/shared/services/cache.service';
import { LanguageService } from 'src/app/shared/services/language.service';

@Component({
  selector: 'app-hero-articles',
  templateUrl: './hero-articles.component.html',
  styleUrls: ['./hero-articles.component.scss']
})
export class HeroArticlesComponent implements OnInit {

  heroArticles: any;
  loading: boolean = true;
  selectedLanguage: string = '';

  constructor(
    private cacheService: CacheService,
    private languageService: LanguageService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.loadData();

    this.translate.onLangChange.subscribe(() => {
      this.loadData();
    });
  }

  loadData() {
    this.selectedLanguage = this.languageService.getSelectedLanguage();

    this.cacheService.getSponsoredArticles(this.selectedLanguage).subscribe(articles => {
      this.heroArticles = articles;
      this.loading = false;
    });
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

}
