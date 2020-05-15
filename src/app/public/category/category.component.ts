import { Component, OnInit, NgModule } from '@angular/core';
import { ArticleService } from 'src/app/shared/services/article.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ActivatedRoute } from '@angular/router';


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
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      console.log('Category Slug', params.get('slug'));

      const slug = params.get('slug');

      this.categoryService.get(slug).subscribe(category => {
        this.category = category;
      });

      this.articleService.getCategory(slug).subscribe(articles => {
        debugger;
        this.articles = articles;
        console.log('Articles', articles);
      });

    });
  }

}
