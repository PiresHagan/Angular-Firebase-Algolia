import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from 'src/app/shared/services/article.service';
import { Article } from 'src/app/shared/interfaces/article.type';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  article: Article;
  articleLikes: number;
  slug: string;
  articleComments: any;
  constructor(
    private articleService: ArticleService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      console.log('Category Slug', params.get('slug'));

      const slug = params.get('slug');
      const articleId = params.get('id');

      this.articleService.getArtical(slug).subscribe(artical => {
        this.article = artical[0];
        const articleId = this.article.id;
        this.articleService.getArticalLikes(articleId).subscribe(likes => {
          this.articleLikes = likes;
        })
        this.getArticicleComments(articleId);
      });

    });
  }
  getArticicleComments(articleId) {
    this.articleService.getArticaleComments(articleId).subscribe((commentList) => {
      this.articleComments = commentList
    })
  }

}
