import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

import { Service } from 'src/app/shared/interfaces/service.type';
import { ServiceService } from 'src/app/shared/services/service.service';
import { LanguageService } from 'src/app/shared/services/language.service';

@Component({
  selector: 'app-similar-services',
  templateUrl: './similar-services.component.html',
  styleUrls: ['./similar-services.component.scss']
})
export class SimilarServicesComponent implements OnInit {

  @Input() service: Service
  similarServiceList;
  selectedLanguage: string = "";

  constructor(
    private serviceService: ServiceService,
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
