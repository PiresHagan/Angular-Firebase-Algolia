import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Router, ActivatedRoute, Routes } from '@angular/router';
import { ArticleService } from 'src/app/shared/services/article.service';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { ACTIVE, DRAFT } from 'src/app/shared/constants/status-constants';
import { NzModalService } from 'ng-zorro-antd';
import { STAFF, AUTHOR, MEMBER } from 'src/app/shared/constants/member-constant';
import { Location } from '@angular/common';
import { BackofficeArticleService } from 'src/app/backoffice/shared/services/backoffice-article.service';

@Component({
  selector: 'app-article-publish',
  templateUrl: './article-publish.component.html',
  styleUrls: ['./article-publish.component.scss']
})
export class ArticlePublishComponent implements OnInit {
  articleId: string;
  loading: boolean = true;
  userDetails;
  article;
  isFormSaving: boolean = false;
  constructor(public userService: UserService,
    public translate: TranslateService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NzModalService,
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
          this.article = await this.articleService.getArticleById(this.articleId, this.userDetails.id, this.userDetails.type);
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
  savePublishStatus() {
    this.isFormSaving = true;
    this.articleService.updateArticleImage(this.articleId, { status: ACTIVE, published_at: new Date().toISOString() }).then(async () => {

      if ((!this.userDetails.type || this.userDetails.type == MEMBER) && this.userDetails.type != STAFF)
        await this.userService.updateMember(this.userDetails.id, { type: AUTHOR });

      this.isFormSaving = false;
      this.showSuccess();

    })


  }
  saveDraftStatus() {
    this.isFormSaving = true;
    this.articleService.updateArticleImage(this.articleId, { status: DRAFT }).then(async () => {
      this.isFormSaving = false;
      if (this.userDetails.type == STAFF)
        this.router.navigate(['/app/admin/article']);
      else
        this.router.navigate(['/app/article']);

    })
  }

  showSuccess() {

    let $message = this.translate.instant("artPublishMsg");
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      $message = this.translate.instant("artPublishMsg");
    })
    this.modalService.confirm({
      nzTitle: "<i>" + $message + "</i>",
      nzOnOk: () => {
        if (this.userDetails.type == STAFF)
          this.router.navigate(['/app/admin/article']);
        else
          this.router.navigate(['/app/article']);
      },
    });
  }
  goBack() {
    this.location.back();
  }


}
