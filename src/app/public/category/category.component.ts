import { Component, OnInit, NgModule, EventEmitter, Output, Input  } from '@angular/core';
import { ArticleService } from 'src/app/shared/services/article.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ThemeConstantService } from '../../shared/services/theme-constant.service';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  @Output() change = new EventEmitter();
  @Input() lang: string;

  category: any;
  articles: any[];

  constructor(
    private categoryService: CategoryService,
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

      this.categoryService.get(slug).subscribe(category => {
        this.category = category;
      });

      this.articleService.getCategory(slug).subscribe(articles => {
        this.articles = articles;
        console.log('Articles', articles);
      });

    });
  }

  

}
