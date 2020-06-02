import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  constructor(
    private titleService: Title,
    private metaTagService: Meta
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("Terms and Conditions");
    this.metaTagService.updateTag({
      name: 'description', 
      content: "Welcome to MyTrendingStories a Subsidiary of Ads Worldwide. Please read these Terms and Conditions before using, or submitting content in any form or medium for publication on MyTrendingStories."
    });
  }

}
