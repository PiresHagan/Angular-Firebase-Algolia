import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/shared/services/article.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ThemeConstantService } from '../../shared/services/theme-constant.service';
import { Title, Meta } from '@angular/platform-browser';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  category: any;
  articles: any[];

  constructor(
    private categoryService: CategoryService,
    private articleService: ArticleService,
    private route: ActivatedRoute,
    public translate: TranslateService,
    private themeService: ThemeConstantService,
    private titleService: Title,
    private metaTagService: Meta
  ) {

  }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      console.log('Category Slug', params.get('slug'));

      const slug = params.get('slug');

      this.categoryService.get(slug).subscribe(category => {
        this.category = category;
        
        this.titleService.setTitle(`${this.category?.title}`);

        this.metaTagService.updateTag({
          name: `${this.category?.long_title}`
        });
      });

      this.articleService.getCategory(slug).subscribe(articles => {
        this.articles = articles;

        console.log('Articles', articles);
      });

    });
  }

}
