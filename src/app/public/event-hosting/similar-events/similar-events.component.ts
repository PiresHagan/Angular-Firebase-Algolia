import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

import { Event } from 'src/app/shared/interfaces/event.type';
import { EventsService } from 'src/app/shared/services/events.services';
import { LanguageService } from 'src/app/shared/services/language.service';

@Component({
  selector: 'app-similar-articles',
  templateUrl: './similar-events.component.html',
  styleUrls: ['./similar-events.component.scss']
})
export class SimilarArticlesComponent implements OnInit {

  @Input() article: Event
  similarArticleList;
  selectedLanguage: string = "";

  constructor(
    private eventService: EventsService,
    private langService: LanguageService
  ) { }

  ngOnInit(): void {
    this.selectedLanguage = this.langService.getSelectedLanguage();

    this.similarArticleList = this.eventService.getCategoryRow(
      this.article.event_type,
      7
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
  SlideRelatedArticle: boolean = false;
slideArticle() {
  this.SlideRelatedArticle = !this.SlideRelatedArticle;
}

}
