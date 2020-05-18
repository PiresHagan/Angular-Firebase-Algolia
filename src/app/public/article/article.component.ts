import { Component, OnInit, EventEmitter, Output, Input  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from 'src/app/shared/services/article.service';
import { Article } from 'src/app/shared/interfaces/article.type';
import { TranslateService } from '@ngx-translate/core';
import { ThemeConstantService } from '../../shared/services/theme-constant.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  @Output() change = new EventEmitter();
  @Input() lang: string;

  article: Article;
  articleLikes: number;
  slug: string;
  articleComments: any;
  constructor(
    private articleService: ArticleService,
    private route: ActivatedRoute,
    public translate: TranslateService,
    private themeService: ThemeConstantService
  ) {
    translate.addLangs(['en', 'nl']);
    translate.setDefaultLang('en');
   }

   switchLang(lang: string) {
    this.translate.use(lang);
  }


  ngOnInit(): void {
    this.themeService.selectedLang.subscribe(lang => this.switchLang(lang));

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
