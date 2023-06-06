import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

import { Politician } from 'src/app/shared/interfaces/politician.type';
import { PoliticianService } from 'src/app/shared/services/politician.service';
import { LanguageService } from 'src/app/shared/services/language.service';

@Component({
  selector: 'app-similar-politicians',
  templateUrl: './similar-politicians.component.html',
  styleUrls: ['./similar-politicians.component.scss']
})
export class SimilarPoliticiansComponent implements OnInit {

  @Input() service: Politician
  similarServiceList;
  selectedLanguage: string = "";

  constructor(
    private serviceService: PoliticianService,
    private langService: LanguageService
  ) { }

  ngOnInit(): void {
    this.selectedLanguage = this.langService.getSelectedLanguage();

    this.similarServiceList = this.serviceService.getCategoryRow(
      this.service.category.slug,
      this.selectedLanguage,
      7,
      this.service.slug,
    );
  }

  replaceImage(url) {
    let latestURL = url
    if (url) {
      latestURL = latestURL.replace('https://mytrendingstories.com/', "https://assets.mytrendingstories.com/")
        .replace('http://cdn.mytrendingstories.com/', "https://cdn.mytrendingstories.com/")
        .replace('https://abc2020new.com/', "https://assets.mytrendingstories.com/");
    }
    return latestURL;
  }

  getRelativeDate(date: string) {
    return moment(date).fromNow();
  }

}
