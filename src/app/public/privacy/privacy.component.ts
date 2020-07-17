import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SeoDataService } from 'src/app/shared/services/seo-data.service';
import { SeoData } from 'src/app/shared/interfaces/seo-data.type';
import { Title, Meta } from '@angular/platform-browser';
import { LanguageService } from 'src/app/shared/services/language.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {
  
  private privacyDocument = "privacy";
  selectedLanguage: string;

  constructor(
    private seoDataService: SeoDataService,
    private titleService: Title,
    private metaTagService: Meta,
    public translate: TranslateService,
    private language: LanguageService,
  ) { }

  ngOnInit(): void {

    this.selectedLanguage = this.language.getSelectedLanguage();

    this.seoDataService.getSeoData(this.privacyDocument).subscribe(privacyDocRef => {
      if(privacyDocRef.exists) {
        const data: SeoData = privacyDocRef.data();

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
      console.log('Error getting privacy seo data', err);
    });

  }

}
