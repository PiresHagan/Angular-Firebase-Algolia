import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/shared/services/article.service';
import { ThemeConstantService } from 'src/app/shared/services/theme-constant.service';
import { Article } from 'src/app/shared/interfaces/article.type';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Title, Meta } from '@angular/platform-browser';
import { CategoryService } from 'src/app/shared/services/category.service';
import { LanguageService } from 'src/app/shared/services/language.service';
import { Category } from 'src/app/shared/interfaces/category.type';
import { AuthorService } from 'src/app/shared/services/author.service';
import { Author } from 'src/app/shared/interfaces/authors.type';
import { Observable } from 'rxjs';
import { SeoDataService } from 'src/app/shared/services/seo-data.service';
import { SeoData } from 'src/app/shared/interfaces/seo-data.type';
import { CacheService } from 'src/app/shared/services/cache.service';
import { newArray } from '@angular/compiler/src/util';
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
  heroArticles: any;
  business: any;
  creative: any;
  entertainment: any;
  life: any;
  showTooltip: string = '';
  selectedLanguage: string = "";
  slugWiseData = {};
  categories;
  authorList: any;
  latestArticles: any;
  trendingArticles: any[] = new Array();
  private homeDocument = "home";

  constructor(
    private articleService: ArticleService,
    private authorService: AuthorService,
    private cacheService: CacheService,
    public translate: TranslateService,
    private themeService: ThemeConstantService,
    private titleService: Title,
    private metaTagService: Meta,
    private categoryService: CategoryService,
    private languageService: LanguageService,
    private seoDataService: SeoDataService
  ) {

  }
  switchLang(lang: string) {
    this.translate.use(lang);
  }

  DefaultAvatar: string = 'assets/images/default-avatar.png';

  ngOnInit(): void {
    this.seoDataService.getSeoData(this.homeDocument).subscribe(homeDocRef => {
      if(homeDocRef.exists) {
        const data: SeoData = homeDocRef.data();

        this.titleService.setTitle(data.title);
    
        this.metaTagService.addTags([
          {name: "description", content: data.description},
          {name: "keywords", content: data.keywords},
          {name: "twitter:card", content: data.description},
          {name: "og:title", content: data.title},
          {name: "og:type", content: data.type},
          {name: "og:url", content: `${window.location.href}`},
          {name: "og:image", content: data.image.url? data.image.url : data.image.alt},
          {name: "og:description", content: data.description}
        ]);
      }
    }, err => {
      console.log('Error getting home seo data', err);
    });

    this.selectedLanguage = this.languageService.getSelectedLanguage();

    this.cacheService.getSponsoredArticles(this.selectedLanguage).subscribe(articles => {
      this.heroArticles = articles;
    });

    this.articleService.getTrending(this.selectedLanguage).subscribe(articles => {
      for (const article of articles) {
        if(article['view_count'] > 30){
          this.trendingArticles.push(article);
        }
      }
    });

    this.articleService.getLatest(this.selectedLanguage).subscribe(articles => {
      this.latestArticles = articles;
    });

    this.getAuthors();
    this.categories = this.categoryService.getAll(this.selectedLanguage);
    this.setArticleData();


    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.selectedLanguage = this.languageService.getSelectedLanguage()
      this.categories = this.categoryService.getAll(this.selectedLanguage);
      this.setArticleData();
      this.getAuthors();

      this.cacheService.getSponsoredArticles(this.selectedLanguage).subscribe(articles => {
        this.heroArticles = articles;
      });

      this.articleService.getTrending(this.selectedLanguage).subscribe(articles => {
        for (const article of articles) {
          if(article['view_count'] > 30){
            this.trendingArticles.push(article);
          }
        }
      });
  
      this.articleService.getLatest(this.selectedLanguage).subscribe(articles => {
        this.latestArticles = articles;
      });
      
    });

    


    return;
  }
  getArticle(slug) {
    return this.articleService.getCategoryRow(slug, this.selectedLanguage)
  }
  setArticleData() {
    this.categories.subscribe((categoryData) => {
      categoryData.forEach(element => {
        this.slugWiseData[element.slug] = this.articleService.getCategoryRow(element.slug, this.selectedLanguage)
      });

    })
  }

  getAuthors() {
    this.authorList = this.cacheService.getTopContributors(this.selectedLanguage);
  }

  replaceImage(url) {
    let latestURL = url
    if (url) {
      latestURL = latestURL.replace('https://mytrendingstories.com/', "https://assets.mytrendingstories.com/")
        .replace('https://cdn.mytrendingstories.com/', "https://assets.mytrendingstories.com/")
        .replace('https://abc2020new.com/', "https://assets.mytrendingstories.com/");
    }
    return latestURL;
  }

}

