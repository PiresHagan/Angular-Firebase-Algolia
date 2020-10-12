import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/shared/services/language.service';
import { SeoService } from 'src/app/shared/services/seo/seo.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {

  private privacyDocument = "privacy";
  selectedLanguage: string;

  constructor(
    public translate: TranslateService,
    private language: LanguageService,
    private seoService: SeoService,
  ) { }

  ngOnInit(): void {
    this.selectedLanguage = this.language.getSelectedLanguage();
    this.seoService.updateTagsWithData(this.privacyDocument);
  }
}
