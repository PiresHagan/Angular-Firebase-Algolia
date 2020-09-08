import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Router, ActivatedRoute, Routes } from '@angular/router';
import { ArticleService } from 'src/app/shared/services/article.service';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { ACTIVE, DRAFT } from 'src/app/shared/constants/status-constants';
import { AUDIO, VIDEO } from 'src/app/shared/constants/article-constants';
import { NzModalService } from 'ng-zorro-antd';
import { STAFF, AUTHOR, MEMBER } from 'src/app/shared/constants/member-constant';
import { Location } from '@angular/common';
import { BackofficeArticleService } from 'src/app/backoffice/shared/services/backoffice-article.service';
import { DomSanitizer } from '@angular/platform-browser';

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
  fileURL: string;
  AUDIO = AUDIO;
  VIDEO = VIDEO;

  constructor(public userService: UserService,
    public translate: TranslateService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NzModalService,
    private location: Location,
    private sanitizer: DomSanitizer,
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
          const format = 'mp4';
          this.fileURL = this.article.type === "video" && `https://player.cloudinary.com/embed/?cloud_name=mytrendingstories&public_id=${this.article.article_file.cloudinary_id}&fluid=true&controls=true&source_types%5B0%5D=${format}`
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
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  savePublishStatus() {
    this.isFormSaving = true;
    this.articleService.updateArticleImage(this.articleId, { status: ACTIVE, published_at: this.article && this.article.published_at ? this.article.published_at : new Date().toISOString() }).then(async () => {

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
        this.router.navigate(['/app/article/articles']);

    })
  }

  showSuccess() {

    let $message = this.translate.instant("artPublishMsg");
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      $message = this.translate.instant("artPublishMsg");
    })
    this.modalService.success({
      nzTitle: "<i>" + $message + "</i>",
      nzOnOk: () => {
        if (this.userDetails.type == STAFF)
          this.router.navigate(['/app/admin/article']);
        else
          this.router.navigate(['/app/article/articles']);
      },
    });
  }
  goBack() {
    this.location.back();
  }


}
