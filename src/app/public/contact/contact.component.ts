import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/shared/services/language.service';
import { SeoService } from 'src/app/shared/services/seo/seo.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  private contactDocument = "contact";

  constructor(
    public translate: TranslateService,
    private seoService: SeoService,
    private language: LanguageService
  ) { }

  ngOnInit(): void {
    this.seoService.updateTagsWithData(this.contactDocument);
  }
}
