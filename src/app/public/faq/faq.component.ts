import { Component, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { LanguageService } from 'src/app/shared/services/language.service';
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
  constructor(
    private titleService: Title,
    private metaTagService: Meta,
    public translate: TranslateService,
      private language: LanguageService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("Frequently asked questions");
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
