import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../../services/analytics/analytics.service';

@Component({
  selector: 'app-share-buttons',
  templateUrl: './share-buttons.component.html',
  styleUrls: ['./share-buttons.component.css']
})
export class ShareButtonsComponent implements OnInit {
  constructor(
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit(): void { }

  public handleShareEvent(soc: string): void {
    this.analyticsService.logEvent('share', {
      platform: soc,
    });
  }
}
