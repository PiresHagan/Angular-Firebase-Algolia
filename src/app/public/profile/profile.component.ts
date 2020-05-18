import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthorService } from 'src/app/shared/services/author.service';
import { ArticleService } from 'src/app/shared/services/article.service';
import { ThemeConstantService } from 'src/app/shared/services/theme-constant.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @Output() change = new EventEmitter();
  @Input() lang: string;

  authorDetails: any = {};
  followers: any = [];
  subscribers: any = [];
  articles: any = [];
  constructor(
    private route: ActivatedRoute,
    private authorService: AuthorService,
    private articleService: ArticleService,
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

      this.authorService.getUserBySlug(slug).subscribe(author => {
        this.authorDetails = author;
        this.getFollowersDetails(author["followers"]);
        this.getSubscribersDetails(author["subscribers"])
        this.getArticleList(author['id']);
      });
    });
  }

  getFollowersDetails(followerList) {
    this.authorService.getAuthorsById(followerList).subscribe((followers) => {
      this.followers = followers;
    })
  }
  getSubscribersDetails(subscriberList) {
    this.authorService.getAuthorsById(subscriberList).subscribe((subscribers) => {
      this.subscribers = subscribers;
    })
  }
  getArticleList(authorId) {
    this.articleService.getArticlesByAuthor(authorId).subscribe((articleList) => {
      console.log(articleList);
      this.articles = articleList;
    })
  }

}
