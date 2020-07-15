import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CampaignService } from 'src/app/backoffice/shared/services/campaign.service';
import { SEARCHENGINECAMPAIGN } from 'src/app/shared/constants/campaign-constants';

@Component({
  selector: 'app-search-engine-campaign',
  templateUrl: './search-engine-campaign.component.html',
  styleUrls: ['./search-engine-campaign.component.scss']
})
export class SearchEngineCampaignComponent implements OnInit {
  price;
  constructor(private router: Router, private campaignService: CampaignService) { }
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
    this.campaignService.getProductPrice(SEARCHENGINECAMPAIGN).subscribe((data: any) => {
      this.price = data.price;
    })
  }
  buySearchEngineSpot() {
    this.router.navigate(['app/campaign/search-engine/buy-search-engine']);
  }

}
