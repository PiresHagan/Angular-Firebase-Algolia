import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CampaignService } from 'src/app/backoffice/shared/services/campaign.service';
import { TOPCONTRIBUTORCAMPAIGN } from 'src/app/shared/constants/campaign-constants';

@Component({
  selector: 'app-top-contributor-campaign',
  templateUrl: './top-contributor-campaign.component.html',
  styleUrls: ['./top-contributor-campaign.component.scss']
})
export class TopContributorCampaignComponent implements OnInit {
  price;
  constructor(private router: Router, private campaignService: CampaignService) { }

  ngOnInit(): void {
    this.campaignService.getProductPrice(TOPCONTRIBUTORCAMPAIGN).subscribe((data: any) => {
      this.price = data[0].price;
    })
  }
  buyTopContributor() {
    this.router.navigate(['app/campaign/top-contributor/buy-top-contributor']);
  }

}
