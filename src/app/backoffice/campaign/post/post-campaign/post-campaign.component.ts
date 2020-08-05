import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CampaignService } from 'src/app/backoffice/shared/services/campaign.service';
import { TOPPOSTCAMPAIGN } from 'src/app/shared/constants/campaign-constants';

@Component({
  selector: 'app-post-campaign',
  templateUrl: './post-campaign.component.html',
  styleUrls: ['./post-campaign.component.scss']
})
export class PostCampaignComponent implements OnInit {

  constructor(private router: Router, private campaignService: CampaignService) { }
  price;
  ngOnInit(): void {
    this.campaignService.getProductPrice(TOPPOSTCAMPAIGN).subscribe((data: any) => {
      this.price = data[0].price;
    })
  }

  buyPostCampaign() {
    this.router.navigate(['app/campaign/sponsored-post/buy-sponsored-post']);
  }
}
