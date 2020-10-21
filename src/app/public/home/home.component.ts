import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/shared/services/article.service';
import { TranslateService } from '@ngx-translate/core';
import { CategoryService } from 'src/app/shared/services/category.service';
import { LanguageService } from 'src/app/shared/services/language.service';
import { CacheService } from 'src/app/shared/services/cache.service';
import { SeoService } from 'src/app/shared/services/seo/seo.service';
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
  selectedLanguage: string = '';
  slugWiseData = {};
  categories: any;
  latestArticles: any;
  trendingArticles: any;
  editorArticles: any;
  private homeDocument = 'home';

  constructor(
    private articleService: ArticleService,
    private cacheService: CacheService,
    public translate: TranslateService,
    private categoryService: CategoryService,
    private languageService: LanguageService,
    private seoService: SeoService
  ) { }

  switchLang(lang: string) {
    this.translate.use(lang);
  }

  DefaultAvatar: string = 'assets/images/default-avatar.png';

  ngOnInit(): void {
    this.seoService.updateTagsWithData(this.homeDocument);

    this.selectedLanguage = this.languageService.getSelectedLanguage();

    console.log(new Date());

    this.cacheService.getTrendingStories(this.selectedLanguage).subscribe(articles => {
      // todo this line is taking almost 5+ seconds
      this.trendingArticles = articles;
    });

    this.cacheService.getLatestStories(this.selectedLanguage).subscribe(articles => {
      // todo this line is taking almost 5+ seconds
      this.latestArticles = articles;
    });

    this.cacheService.getEditorStories(this.selectedLanguage).subscribe(articles => {
      // todo this line is taking almost 5+ seconds
      this.editorArticles = articles;
    });

    this.categories = this.categoryService.getAll(this.selectedLanguage);
    this.setArticleData();

    this.translate.onLangChange.subscribe(() => {
      this.selectedLanguage = this.languageService.getSelectedLanguage()
      this.categories = this.categoryService.getAll(this.selectedLanguage);
      this.setArticleData();

      this.cacheService.getTrendingStories(this.selectedLanguage).subscribe(articles => {
        this.trendingArticles = articles;
      });

      this.cacheService.getLatestStories(this.selectedLanguage).subscribe(articles => {
        this.latestArticles = articles;
      });

      this.cacheService.getEditorStories(this.selectedLanguage).subscribe(articles => {
        this.editorArticles = articles;
      });
    });
  }

  getArticle(slug) {
    return this.articleService.getCategoryRow(slug, this.selectedLanguage, 5)
  }

  setArticleData() {
    this.categories.subscribe((categoryData) => {
      categoryData.forEach(element => {
        this.slugWiseData[element.slug] = this.articleService.getCategoryRow(element.slug, this.selectedLanguage, 5)
      });

    })
  }

  replaceImage(url) {
    let latestURL = url
    if (url) {
      latestURL = latestURL.replace('https://mytrendingstories.com/', 'https://assets.mytrendingstories.com/')
        .replace('http://cdn.mytrendingstories.com/', 'https://cdn.mytrendingstories.com/')
        .replace('https://abc2020new.com/', 'https://assets.mytrendingstories.com/');
    }
    return latestURL;
  }
  skeletonData = new Array(5).fill({}).map((_i, index) => {
    return 
  });
  TrendingskeletonData = new Array(15).fill({}).map((_i, index) => {
    return 
  });
}

