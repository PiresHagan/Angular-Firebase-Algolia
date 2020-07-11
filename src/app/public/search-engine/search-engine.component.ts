import { Component, OnInit } from '@angular/core';
import * as algoliasearch from 'algoliasearch/lite';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { LanguageService } from 'src/app/shared/services/language.service';
import * as firebase from 'firebase/app';
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
  config = {
    indexName: 'dev_articles',
    searchClient,
    routing: true
  };
  
  constructor (
    public translate: TranslateService,
    private languageService: LanguageService
  ){
  }
  ngOnInit(): void {
    this.selectedLanguage = this.languageService.getSelectedLanguage();
    this.config.indexName = `prod_articles_${this.selectedLanguage}`;

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.selectedLanguage = this.languageService.getSelectedLanguage();
      this.config.indexName = `prod_articles_${this.selectedLanguage}`;
    });
  }
  public OrderIndex = 0;
  articleBrand = [
    {
      image:'./assets/images/search-engine/nike.png',
      name:'Nike'
    },
    {
      image:'./assets/images/search-engine/fb.png',
      name:'Facebook'
    },
    {
      image:'./assets/images/search-engine/ebay.png',
      name:'Ebay'
    },
    {
      image:'./assets/images/search-engine/ibm.png',
      name:'IBM'
    },
    {
      image:'./assets/images/search-engine/apple.png',
      name:'Apple'
    },
    {
      image:'./assets/images/search-engine/lakers.png',
      name:'Lakers'
    },
    {
      image:'./assets/images/search-engine/amazon.png',
      name:'Amazon'
    },
    {
      image:'./assets/images/search-engine/uber.png',
      name:'Uber'
    },
    {
      image:'./assets/images/search-engine/reebok.png',
      name:'Reebok'
    },

  ];

}
