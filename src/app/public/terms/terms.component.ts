import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  constructor(
    private titleService: Title,
    private metaTagService: Meta,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("Terms and Conditions");

    this.metaTagService.addTags([
      {name: "description", content: "Welcome to MyTrendingStories a Subsidiary of Ads Worldwide. Please read these Terms and Conditions before using, or submitting content in any form or medi"},
      {name: "keywords", content: "Terms and Conditions"},
      {name: "twitter:card", content: "Welcome to MyTrendingStories a Subsidiary of Ads Worldwide. Please read these Terms and Conditions before using, or submitting content in any form or medi"},
      {name: "og:title", content: "Terms and Conditions"},
      {name: "og:type", content: "terms and conditons"},
      {name: "og:url", content: `${window.location.href}`},
      //{name: "og:image", content: `${this.authorDetails.avatar.url}`},
      {name: "og:description", content: "Welcome to MyTrendingStories a Subsidiary of Ads Worldwide. Please read these Terms and Conditions before using, or submitting content in any form or medi"}
    ]);
  }

}
