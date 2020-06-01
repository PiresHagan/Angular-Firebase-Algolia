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
    this.metaTagService.updateTag({
      name: 'faq', 
      content: "I wrote an article but cannot find it on the My Trending Stories website. Double-check to make sure that your articles is saved as “published” and not as “draft” or “in rereading”"
    });
  }
}
