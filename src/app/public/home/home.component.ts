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
  showTooltip: string = '';
  selectedLanguage: string = "";
  slugWiseData = {};
  categories;
  authorList: any;

  constructor(
    private articleService: ArticleService,
    private authorService: AuthorService,
    public translate: TranslateService,
    private themeService: ThemeConstantService,
    private titleService: Title,
    private metaTagService: Meta,
    private categoryService: CategoryService,
    private languageService: LanguageService
  ) {

  }
  switchLang(lang: string) {
    this.translate.use(lang);
  }

  ngOnInit(): void {
    this.titleService.setTitle("Home");

    this.metaTagService.addTags([
      { name: "description", content: "My trending stories home page" },
      { name: "keywords", content: "Home" },
      { name: "twitter:card", content: "My trending stories home page" },
      { name: "og:title", content: "Home" },
      { name: "og:type", content: "home" },
      { name: "og:url", content: `${window.location.href}` },
      // {name: "og:image", content: `${this.authorDetails.avatar.url}`},
      { name: "og:description", content: "My trending stories home page" }
    ]);


    this.selectedLanguage = this.languageService.getSelectedLanguage();

    this.articleService.getHeroLargeArticle(this.selectedLanguage).subscribe(article => {
      this.heroLarge = article[0];
    });


    this.articleService.getHeroSmallArticle(this.selectedLanguage).subscribe(articles => {
      this.heroSmall = articles;
    });

    this.getAuthors();



    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.selectedLanguage = this.languageService.getSelectedLanguage()
      this.categories = this.categoryService.getAll(this.selectedLanguage);

      this.articleService.getHeroLargeArticle(this.selectedLanguage).subscribe(article => {
        this.heroLarge = article[0];
      });


      this.articleService.getHeroSmallArticle(this.selectedLanguage).subscribe(articles => {
        this.heroSmall = articles;
      });

      this.setArticleData();
    })

    this.categories = this.categoryService.getAll(this.selectedLanguage);
    this.setArticleData();


    return;
  }
  getArticle(slug) {
    return this.articleService.getCategoryRow(slug)
  }
  setArticleData() {
    this.categories.subscribe((categoryData) => {
      categoryData.forEach(element => {
        this.slugWiseData[element.slug] = this.articleService.getCategoryRow(element.slug, this.selectedLanguage)
      });

    })
  }

  getAuthors() {
    this.authorList = this.authorService.getAuthors();

  }
  replaceImage(url) {
    let latestURL = url
    if (url) {
      latestURL = latestURL.replace('https://mytrendingstories.com/', "http://assets.mytrendingstories.com/");
      latestURL = latestURL.replace('https://cdn.mytrendingstories.com/', "http://assets.mytrendingstories.com/");
    }
    return latestURL;
  }

}

