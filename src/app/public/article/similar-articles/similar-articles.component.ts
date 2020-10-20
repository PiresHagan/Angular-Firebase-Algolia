import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-similar-articles',
  templateUrl: './similar-articles.component.html',
  styleUrls: ['./similar-articles.component.scss']
})
export class SimilarArticlesComponent implements OnInit {

  @Input() similarArticleList;

  constructor() { }

  ngOnInit(): void {
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
