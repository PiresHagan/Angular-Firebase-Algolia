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
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-article-image',
  templateUrl: './article-image.component.html',
  styleUrls: ['./article-image.component.scss']
})
export class ArticleImageComponent implements OnInit {
  file: any;;
  articleImage;
  loading: boolean = false;
  articleId: string;
  alternative: string = "";
  title: string = "";
  imageTypeErrorMsg: string = "";
  imageSizeErrorMsg: string = "";
  imageGeneralErrorMsg: string = "";
  isFormSaving: boolean = false;
  constructor(private msg: NzMessageService,
    public translate: TranslateService,
    public authService: AuthService,
    public userService: UserService,
    public articleService: ArticleService,
    private route: ActivatedRoute,
    private modalService: NzModalService, private db: AngularFirestore) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {

      this.articleId = params.get('articleId');

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
    if (!this.file) {
      this.imageGeneralErrorMsg = this.translate.instant("artImageGeneralErr");;
      this.modalService.warning({
        nzTitle: "<i>" + this.imageGeneralErrorMsg + "</i>",
      });
      return;
    }
    this.isFormSaving = true;
    this.articleService.addArticleImage(this.articleId, this.getImageObject()).then(() => {
      this.isFormSaving = false;
    })
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
      caption: this.title

    }
  }


}
