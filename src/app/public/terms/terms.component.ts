import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { SeoDataService } from 'src/app/shared/services/seo-data.service';
import { SeoData } from 'src/app/shared/interfaces/seo-data.type';
@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  private termsAndCondDoc = "terms_and_conditions";

  constructor(
    private titleService: Title,
    private metaTagService: Meta,
    public translate: TranslateService,
    private seoDataService: SeoDataService
  ) { }

  ngOnInit(): void {
    this.seoDataService.getSeoData(this.termsAndCondDoc).subscribe(tacDocRef => {
      if(tacDocRef.exists) {
        const data: SeoData = tacDocRef.data();

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
      console.log('Error getting terms and condition seo data', err);
    });
  }
}
