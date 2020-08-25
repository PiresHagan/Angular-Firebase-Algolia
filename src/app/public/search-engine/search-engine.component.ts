import { Component, OnInit } from '@angular/core';
import * as algoliasearch from 'algoliasearch/lite';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { LanguageService } from 'src/app/shared/services/language.service';
import * as firebase from 'firebase/app';
import { CacheService } from 'src/app/shared/services/cache.service';
const searchClient = algoliasearch(
  'N7WFUORZZU',
  '6f5d2e637debb45f0078b85091532c42'
);
@Component({
  selector: 'app-search-engine',
  templateUrl: './search-engine.component.html',
  styleUrls: ['./search-engine.component.scss']
})
export class SearchEngineComponent implements OnInit {
  selectedLanguage: string = "";
  articleBrand: any;
  buyCount:any;
  config = {
    indexName: 'dev_fullsearch',
    searchClient,
    routing: true
  };
  //public OrderIndex = 0;
  //articleBrand = [];

  constructor(
    public translate: TranslateService,
    private languageService: LanguageService,
    private cacheService: CacheService
  ) {
  }
  ngOnInit(): void {
    this.selectedLanguage = this.languageService.getSelectedLanguage();
    this.config.indexName = `prod_fullsearch_${this.selectedLanguage}`;

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.selectedLanguage = this.languageService.getSelectedLanguage();
      this.config.indexName = `prod_fullsearch_${this.selectedLanguage}`;
    });

    this.cacheService.getBrands().subscribe(brands => {
      this.articleBrand = brands;
    this.buyCount = 10 - this.articleBrand.length;
    });
  }
  ShowBtn(n: number): any[] {
    return Array(n);
  }
}
