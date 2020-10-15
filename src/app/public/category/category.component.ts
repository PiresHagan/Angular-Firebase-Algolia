import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/shared/services/article.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LanguageService } from 'src/app/shared/services/language.service';
import { Category } from 'src/app/shared/interfaces/category.type';
import * as firebase from 'firebase/app';
import { SeoService } from 'src/app/shared/services/seo/seo.service';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  category: Category;
  articles: any[];
  loading: boolean = true;
  loadingMore: boolean = false;
  lastVisible: any = null;
  slug = '';
  topic: string = '';
  selectedLanguage: string = "";
  pageHeader: string = '';
  newsLetterForm = new FormGroup({
    email: new FormControl('')
  });
  errorSubscribe: boolean = false;
  successSubscribe: boolean = false;
  constructor(
    private categoryService: CategoryService,
    private articleService: ArticleService,
    private route: ActivatedRoute,
    public translate: TranslateService,
    private languageService: LanguageService,
    private seoService: SeoService,
    private analyticsService: AnalyticsService,
  ) { }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scrollEvent, true);
    this.selectedLanguage = this.languageService.getSelectedLanguage();

    this.route.queryParams.subscribe(() => {
      this.topic = this.route.snapshot.queryParamMap.get('topic');
      this.getPageDetails();
    });

    this.route.paramMap.subscribe(params => {
      console.log('Category Slug', params.get('slug'));
      this.topic = this.route.snapshot.queryParamMap.get('topic');
      const slug = params.get('slug');
      this.slug = slug;
      this.category = null;

      if (this.topic) {
        this.getTopicDetails(this.topic);
      }

      this.categoryService.getCategoryBySlug(slug).subscribe(category => {
        this.category = category;
        if (!this.topic) {
          this.pageHeader = this.category?.title;
        }

        this.seoService.updateMetaTags(this.category.meta || {});
      });

      this.getPageDetails();
    });
  }

  scrollEvent = (event: any): void => {
    let documentElement = event.target.documentElement ? event.target.documentElement : event.target;
    if (documentElement) {
      const top = documentElement.scrollTop
      const height = documentElement.scrollHeight
      const offset = documentElement.offsetHeight
      if (top > height - offset - 1 - 100 && this.lastVisible && !this.loadingMore) {
        this.loadingMore = true;
        this.articleService.getArticlesBySlug(20, 'next', this.lastVisible, this.slug, this.topic, this.selectedLanguage).subscribe((data) => {
          this.loadingMore = false;
          this.articles = [...this.articles, ...data.articleList];
          this.lastVisible = data.lastVisible;
        });
      }
    }

  }
  replaceImage(url) {
    let latestURL = url
    if (url) {
      latestURL = latestURL.replace('https://mytrendingstories.com/', "https://assets.mytrendingstories.com/")
        .replace('http://cdn.mytrendingstories.com/', "https://cdn.mytrendingstories.com/")
        .replace('https://abc2020new.com/', "https://assets.mytrendingstories.com/");
    }
    return latestURL;
  }

  submit() {
    if (this.newsLetterForm.valid) {
      this.categoryService.addSubscription(this.category, this.newsLetterForm.value.email).then(() => {
        this.analyticsService.logEvent("newsletter_subscription", {
          category_title: this.category.title,
          category_id: this.category.id,
          user_email: this.newsLetterForm.value.email
        });

        this.newsLetterForm.reset();
      }).catch(err => {
        console.error('Error while subscribing', err);
      });
      this.successSubscribe = true;
      setTimeout(() => {
        this.successSubscribe = false;
      }, 4000);
      this.errorSubscribe = false;
    } else {
      this.errorSubscribe = true;
      this.successSubscribe = false;
    }
  }
  getTopicDetails(topicSlug: string) {
    this.categoryService.getTopicBySlug(topicSlug).subscribe((topicData: Category) => {
      if (topicData?.title)
        this.pageHeader = topicData?.title;
      console.log(topicData);
    })

  }
  getPageDetails() {
    this.getTopicDetails(this.topic);
    this.articleService.getArticlesBySlug(20, '', this.lastVisible, this.slug, this.topic, this.selectedLanguage).subscribe((data) => {
      this.articles = data.articleList;
      this.lastVisible = data.lastVisible;
      this.loading = false;
    });
  }

}
