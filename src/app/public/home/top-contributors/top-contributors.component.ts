import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { CacheService } from 'src/app/shared/services/cache.service';
import { LanguageService } from 'src/app/shared/services/language.service';

@Component({
  selector: 'app-top-contributors',
  templateUrl: './top-contributors.component.html',
  styleUrls: ['./top-contributors.component.scss']
})
export class TopContributorsComponent implements OnInit {

  authorList: any;
  selectedLanguage: string = '';
  showTooltip: string = '';

  constructor(
    private cacheService: CacheService,
    private languageService: LanguageService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.getAuthors();

    this.translate.onLangChange.subscribe(() => {
      this.getAuthors();
    });
  }

  getAuthors() {
    this.selectedLanguage = this.languageService.getSelectedLanguage();

    this.authorList = this.cacheService.getTopContributors(this.selectedLanguage);
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
  skeletonData = new Array(10).fill({}).map((_i, index) => {
    return 
  });
}
