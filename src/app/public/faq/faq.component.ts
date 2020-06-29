import { Component, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { LanguageService } from 'src/app/shared/services/language.service';
import { SeoDataService } from 'src/app/shared/services/seo-data.service';
import { SeoData } from 'src/app/shared/interfaces/seo-data.type';
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  enFaqImg:boolean;
  frFaqImg:boolean;
  esFaqImg:boolean;
  selectedLanguage: string;
  languageList: any;
  private faqDocument = "faq";
  constructor(
    private titleService: Title,
    private metaTagService: Meta,
    public translate: TranslateService,
    private language: LanguageService,
    private seoDataService: SeoDataService
  ) { }

  ngOnInit(): void {
    this.selectedLanguage = this.language.getSelectedLanguage();
    console.log(this.selectedLanguage)
    if(this.selectedLanguage == 'fr'){
      this.frFaqImg= true;
      this.esFaqImg = false;
      this.enFaqImg = false;
    }else if (this.selectedLanguage == 'es'){
      this.esFaqImg = true;
      this.frFaqImg= false;
      this.enFaqImg = false;
    }else if (this.selectedLanguage == 'en'){
      this.enFaqImg = true;
      this.frFaqImg= false;
      this.esFaqImg = false;
    }
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.selectedLanguage = this.language.getSelectedLanguage()
      if(this.selectedLanguage == 'fr'){
        this.frFaqImg= true;
        this.esFaqImg = false;
        this.enFaqImg = false;
      }else if (this.selectedLanguage == 'es'){
        this.esFaqImg = true;
        this.frFaqImg= false;
        this.enFaqImg = false;
      }else if (this.selectedLanguage == 'en'){
        this.enFaqImg = true;
        this.frFaqImg= false;
        this.esFaqImg = false;
      }
    }); 

    this.seoDataService.getSeoData(this.faqDocument).subscribe(faqDocRef => {
      if(faqDocRef.exists) {
        const data: SeoData = faqDocRef.data();

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
      console.log('Error getting faq seo data', err);
    });
    
  }
}
