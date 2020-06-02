import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/shared/services/article.service';
import { ThemeConstantService } from 'src/app/shared/services/theme-constant.service';
import { Article } from 'src/app/shared/interfaces/article.type';
import { TranslateService } from '@ngx-translate/core';
import { Title, Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  secTitle: any;
  // secTitle:any='You might also like';
  heroLarge: any;
  heroSmall: any;
  business: any;
  creative: any;
  entertainment: any;
  life: any;
  categories: any[] = new Array();
  showTooltip: string = '';


  constructor(
    private articleService: ArticleService,
    public translate: TranslateService,
    private themeService: ThemeConstantService,
    private titleService: Title,
    private metaTagService: Meta
  ) {

  }
  switchLang(lang: string) {
    this.translate.use(lang);
  }

  ngOnInit(): void {    
    this.titleService.setTitle("Home");

    this.metaTagService.updateTag({
      name: 'home'
    });

    this.articleService.getHeroLargeArticle().subscribe(article => {
      this.heroLarge = article[0];
    });


    this.articleService.getHeroSmallArticle().subscribe(articles => {
      this.heroSmall = articles;
    });


    this.articleService.getCategoryRow('business').subscribe(articles => {
      const category = {
        'articles': articles,
        'title': 'Business',
        'slug': 'business',
        'class': 'cat-light-blue',
        'item-card': 'item-card-business',
      };
      this.categories.push(category);
    });

    this.articleService.getCategoryRow('creative').subscribe(articles => {
      const category = {
        'articles': articles,
        'title': 'Creative',
        'slug': 'creative',
        'class': 'cat-orange',
        'item-card': 'item-card-creative',
      };
      this.categories.push(category);
    });

    this.articleService.getCategoryRow('entertainment').subscribe(articles => {
      const category = {
        'articles': articles,
        'title': 'Entertainment',
        'slug': 'entertainment',
        'class': 'cat-red',
        'item-card': 'item-card-entertainment',
      };
      this.categories.push(category);
    });

    this.articleService.getCategoryRow('life-and-styles').subscribe(articles => {
      const category = {
        'articles': articles,
        'title': 'Life and styles',
        'slug': 'life-and-styles',
        'class': 'cat-yellow',
        'item-card': 'item-card-life-and-styles',
      };
      this.categories.push(category);
    });

    this.articleService.getCategoryRow('news').subscribe(articles => {
      const category = {
        'articles': articles,
        'title': 'News',
        'slug': 'news',
        'class': 'cat-orange',
        'item-card': 'item-card-news',
      };
      this.categories.push(category);
    });

    this.articleService.getCategoryRow('religion').subscribe(articles => {
      const category = {
        'articles': articles,
        'title': 'Religion',
        'slug': 'religion',
        'class': 'cat-cyan',
        'item-card': 'item-card-religion',
      };
      this.categories.push(category);
    });

    this.articleService.getCategoryRow('tech-and-science').subscribe(articles => {
      const category = {
        'articles': articles,
        'title': 'Tech and science',
        'slug': 'tech-and-science',
        'class': 'cat-green',
        'item-card': 'item-card-tech-and-science',
      };
      this.categories.push(category);
    });
  }


}

