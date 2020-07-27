import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../../interfaces/article.type';

@Component({
  selector: 'article-interaction',
  templateUrl: './article-interaction.component.html',
  styleUrls: ['./article-interaction.component.css']
})
export class ArticleInteractionComponent implements OnInit {
  @Input() article: Article;
  constructor() { }
  likeCount: number;
  viewCount: number;
  commentCount: number;
  ngOnInit(): void {
    if (this.article) {
      this.likeCount = this.article?.likes_count;
      this.viewCount = this.article?.view_count;
      this.commentCount = this.article?.comments_count;
    } else {
      console.log('Article not received')
    }

  }

}
