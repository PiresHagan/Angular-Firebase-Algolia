import { Component, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  constructor(
    private titleService: Title,
    private metaTagService: Meta
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("Frequently asked questions");

    this.metaTagService.addTags([
      {name: "description", content: "I wrote an article but cannot find it on the My Trending Stories website. Double-check to make sure that your articles is saved as “published” and not as "},
      {name: "keywords", content: "Frequently asked questions"},
      {name: "twitter:card", content: "I wrote an article but cannot find it on the My Trending Stories website. Double-check to make sure that your articles is saved as “published” and not as "},
      {name: "og:title", content: "Frequently asked questions"},
      {name: "og:type", content: "faq"},
      {name: "og:url", content: `${window.location.href}`},
      // {name: "og:image", content: `${this.authorDetails.avatar.url}`},
      {name: "og:description", content: "I wrote an article but cannot find it on the My Trending Stories website. Double-check to make sure that your articles is saved as “published” and not as "}
    ]);
  }
}
