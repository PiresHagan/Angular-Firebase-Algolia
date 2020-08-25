import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { UserService } from 'src/app/shared/services/user.service';
import { ArticleService } from 'src/app/shared/services/article.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { Location } from '@angular/common';
import { BackofficeArticleService } from 'src/app/backoffice/shared/services/backoffice-article.service';

@Component({
  selector: 'app-article-seo',
  templateUrl: './article-seo.component.html',
  styleUrls: ['./article-seo.component.scss']
})
export class ArticleSeoComponent implements OnInit {

  articleId: string;
  article;
  userDetails;
  isFormSaving: boolean = false;
  title;
  keywords;
  description;

  loading: boolean = true;
  constructor(private route: ActivatedRoute,
    public userService: UserService,
    public translate: TranslateService,
    public authService: AuthService,
    private router: Router,
    private location: Location,
    public articleService: BackofficeArticleService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {

      this.articleId = params.get('articleId');
      this.setArticleData();

    })
  }
  setArticleData() {
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;
      this.userDetails = await this.authService.getLoggedInUserDetails();
      if (this.articleId) {
        try {

          this.article = await this.articleService.getArticleById(this.articleId, null, this.userDetails.type);
          this.title = this.article && this.article.meta && this.article.meta.title ? this.article.meta.title : '';
          this.keywords = this.article && this.article.meta && this.article.meta.keywords ? this.article.meta.keywords : '';
          this.description = this.article && this.article.meta && this.article.meta.description ? this.article.meta.description : '';

        } catch (error) {
          this.article = null;
          this.router.navigate(['/app/error'])
        }
      } else {
        console.log('Unknown entity');
        this.router.navigate(['/app/error'])
      }
      this.loading = false;


    })

  }
  saveMetaData() {
    this.isFormSaving = true;
    this.articleService.updateArticle(this.articleId, this.getMetaDetails()).then(() => {
      this.isFormSaving = false;
      this.router.navigate(['/app/article/compose/publish', this.articleId]);

    })

  }
  getMetaDetails() {
    return {
      meta: {
        title: this.title,
        keywords: this.keywords,
        description: this.description
      }
    }
  }
  goBack() {
    this.location.back();
  }


}
