import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-engine-campaign',
  templateUrl: './search-engine-campaign.component.html',
  styleUrls: ['./search-engine-campaign.component.scss']
})
export class SearchEngineCampaignComponent implements OnInit {

  constructor(private router: Router) { }
  articleBrand = [
    {
      image: './assets/images/search-engine/nike.png',
      name: 'Nike'
    },
    {
      image: './assets/images/search-engine/fb.png',
      name: 'Facebook'
    },
    {
      image: './assets/images/search-engine/ebay.png',
      name: 'Ebay'
    },
    {
      image: './assets/images/search-engine/ibm.png',
      name: 'IBM'
    },
    {
      image: './assets/images/search-engine/apple.png',
      name: 'Apple'
    },
    {
      image: './assets/images/search-engine/lakers.png',
      name: 'Lakers'
    },
    {
      image: './assets/images/search-engine/amazon.png',
      name: 'Amazon'
    },
    {
      image: './assets/images/search-engine/uber.png',
      name: 'Uber'
    },
    {
      image: './assets/images/search-engine/reebok.png',
      name: 'Reebok'
    },

  ];

  ngOnInit(): void {
  }
  buySearchEngineSpot() {
    this.router.navigate(['app/campaign/search-engine/buy-search-engine']);
  }

}
