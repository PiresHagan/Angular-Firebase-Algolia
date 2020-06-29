import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ThemeConstantService } from 'src/app/shared/services/theme-constant.service';
import { TranslateService } from '@ngx-translate/core';
import { SeoDataService } from 'src/app/shared/services/seo-data.service';
import { SeoData } from 'src/app/shared/interfaces/seo-data.type';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  private contactDocument = "contact";

  constructor(
    private titleService: Title,
    private metaTagService: Meta,
    public translate: TranslateService,
    private seoDataService: SeoDataService
  ) { }

  ngOnInit(): void {
    this.seoDataService.getSeoData(this.contactDocument).subscribe(contactDocRef => {
      if(contactDocRef.exists) {
        const data: SeoData = contactDocRef.data();

        this.titleService.setTitle(data.title);
    
        this.metaTagService.addTags([
          {name: "description", content: data.description},
          {name: "keywords", content: data.keywords},
          {name: "twitter:card", content: data.description},
          {name: "og:title", content: data.title},
          {name: "og:type", content: data.type},
          {name: "og:url", content: `${window.location.href}`},
          {name: "og:image", content: data.image.url? data.image.url : data.image.alt},
          {name: "og:description", content: data.description}
        ]);
      }
    }, err => {
      console.log('Error getting contact seo data', err);
    });
  }

}
