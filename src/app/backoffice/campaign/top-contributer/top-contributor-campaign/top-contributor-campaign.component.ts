import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-contributor-campaign',
  templateUrl: './top-contributor-campaign.component.html',
  styleUrls: ['./top-contributor-campaign.component.scss']
})
export class TopContributorCampaignComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  buyTopContributor() {
    this.router.navigate(['app/campaign/top-contributor/buy-top-contributor']);
  }

}
