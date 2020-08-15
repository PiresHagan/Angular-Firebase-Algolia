import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../../interfaces/article.type';
@Component({
  selector: 'app-article-avatar',
  templateUrl: './article-avatar.component.html',
  styleUrls: ['./article-avatar.component.scss']
})
export class ArticleAvatarComponent implements OnInit {
  @Input() article: Article;
  constructor() {

  }
  ngOnInit(): void {
  }
 
}
