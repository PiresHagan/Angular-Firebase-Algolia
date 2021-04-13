import { Component, OnInit, Input} from '@angular/core';
import { Article } from '../../interfaces/article.type';
@Component({
  selector: 'app-cloudinary-feature-img',
  templateUrl: './cloudinary-feature-img.component.html',
  styleUrls: ['./cloudinary-feature-img.component.css']
})
export class CloudinaryFeatureImgComponent implements OnInit {
  @Input() article: Article;
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
}
