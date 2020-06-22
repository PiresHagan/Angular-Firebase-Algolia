import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-campaign-search-engine',
  templateUrl: './campaign-search-engine.component.html',
  styleUrls: ['./campaign-search-engine.component.scss']
})
export class CampaignSearchEngineComponent implements OnInit {

  constructor() { }
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

  ngOnInit(): void {
  }

}
