import { Component, OnInit } from '@angular/core';
import * as algoliasearch from 'algoliasearch/lite';
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
  config = {
    indexName: 'dev_articles',
    searchClient
  };
  constructor (){

    
  
  }
  ngOnInit(): void {

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
