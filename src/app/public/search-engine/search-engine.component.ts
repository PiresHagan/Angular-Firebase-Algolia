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
    indexName: 'dev_fullsearch',
    searchClient,
    searchFunction(helper) {
      helper.search();
      const analytics = firebase.analytics();
    
      analytics.logEvent('search', {
        query: helper.state.query
      });
    }
  };
  
  constructor (
    public translate: TranslateService,
    private languageService: LanguageService
  ){
  }
  ngOnInit(): void {
    this.selectedLanguage = this.languageService.getSelectedLanguage();
    this.config.indexName = `dev_fullsearch_${this.selectedLanguage}`;

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.selectedLanguage = this.languageService.getSelectedLanguage();
      this.config.indexName = `dev_fullsearch_${this.selectedLanguage}`;
    });
  }
  public OrderIndex = 0;
  articleBrand = [
    {
      image:'./assets/images/search-engine/1.jpg',
      name:'NikeNikeNike'
    },
    {
      image:'./assets/images/search-engine/a.jpg',
      name:'Facebook'
    },
    {
      image:'./assets/images/search-engine/c.jpg',
      name:'Ebay'
    },
    {
      image:'./assets/images/search-engine/1.jpg',
      name:'IBM'
    },
    {
      image:'./assets/images/search-engine/a.jpg',
      name:'Apple'
    },
    {
      image:'./assets/images/search-engine/c.jpg',
      name:'Lakers'
    },
    {
      image:'./assets/images/search-engine/1.jpg',
      name:'Amazon'
    },
    {
      image:'./assets/images/search-engine/a.jpg',
      name:'Uber'
    },
    {
      image:'./assets/images/search-engine/c.jpg',
      name:'Reebok'
    },

  ];

}
