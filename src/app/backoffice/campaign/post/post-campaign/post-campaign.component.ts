import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-campaign',
  templateUrl: './post-campaign.component.html',
  styleUrls: ['./post-campaign.component.scss']
})
export class PostCampaignComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  buyPostCampaign() {
    this.router.navigate(['app/campaign/sponsored-post/buy-sponsored-post']);
  }
}
