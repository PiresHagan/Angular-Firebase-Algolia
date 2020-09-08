import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadChangeParam, UploadFile } from 'ng-zorro-antd/upload';
import { TranslateService, LangChangeEvent } from "@ngx-translate/core";
import { AuthService } from 'src/app/shared/services/authentication.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ArticleService } from 'src/app/shared/services/article.service';
import { NzModalService } from 'ng-zorro-antd';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { BackofficeArticleService } from 'src/app/backoffice/shared/services/backoffice-article.service';
@Component({
  selector: 'app-article-image',
  templateUrl: './article-image.component.html',
  styleUrls: ['./article-image.component.scss']
})
export class ArticleImageComponent implements OnInit {
  file: any;;
  articleImage;
  articleId: string;
  alternative: string = "";
  title: string = "";
  imageTypeErrorMsg: string = "";
  imageSizeErrorMsg: string = "";
  imageGeneralErrorMsg: string = "";
  isFormSaving: boolean = false;
  userDetails: any;
  loading: boolean = true;
  article: any;
  constructor(private msg: NzMessageService,
    public translate: TranslateService,
    public authService: AuthService,
    public userService: UserService,
    public articleService: BackofficeArticleService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private modalService: NzModalService, private db: AngularFirestore) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {

      this.articleId = params.get('articleId');
      this.setArticleData();

    })


    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.imageTypeErrorMsg = this.translate.instant("artImageTypeErr");
      this.imageSizeErrorMsg = this.translate.instant("artImageSizeErr");;
      this.imageGeneralErrorMsg = this.translate.instant("artImageGeneralErr");
    })
  }

  beforeUpload = (file: UploadFile, _fileList: UploadFile[]) => {

    this.imageTypeErrorMsg = this.translate.instant("artImageTypeErr");;
    this.imageSizeErrorMsg = this.translate.instant("artImageSizeErr");;


    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      this.msg.error(this.imageTypeErrorMsg);
      return false;
    }

    const isLt2M = file.size! / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.msg.error(this.imageSizeErrorMsg);
      return false;
    }
    this.file = file;
    try {
      this.getBase64(file, (img: string) => {
        this.loading = false;
        this.articleImage = img;


      });
    } catch (error) {
      this.file = null;
      this.msg.error(this.imageGeneralErrorMsg);
    }

    return false;
  };

  saveArticleImage() {
    if (!this.file && !this.articleImage) {
      this.imageGeneralErrorMsg = this.translate.instant("artImageGeneralErr");;
      this.modalService.warning({
        nzTitle: "<i>" + this.imageGeneralErrorMsg + "</i>",
      });
      return;
    }

    this.isFormSaving = true;
    if (this.file) {
      this.articleService.addArticleImage(this.articleId, this.getImageObject()).then(() => {
        this.router.navigate(['/app/article/compose/seo', this.articleId]);
        this.isFormSaving = false;
      })
    } else {
      this.articleService.updateArticle(this.articleId, this.getUpdatedObject()).then(() => {
        this.router.navigate(['/app/article/compose/seo', this.articleId]);
        this.isFormSaving = false;
      })
    }

  }

  private getBase64(img, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }
  getImageObject() {
    return {
      file: this.file,
      alt: this.alternative,
    }
  }
  getUpdatedObject() {
    return {
      image: { url: this.articleImage, alt: this.alternative }
    }
  }
  setArticleData() {
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;
      this.userDetails = await this.authService.getLoggedInUserDetails();
      if (this.articleId) {
        try {

          this.article = await this.articleService.getArticleById(this.articleId, null, this.userDetails.type);
          this.articleImage = this.article && this.article.image && this.article.image.url ? this.article.image.url : '';
          this.alternative = this.article && this.article.image && this.article.image.alt ? this.article.image.alt : '';

        } catch (error) {
          this.router.navigate(['/app/error'])
        }
      } else {
        this.router.navigate(['/app/error'])
      }
      this.loading = false;


    })

  }
  goBack() {
    this.location.back();
  }



}
