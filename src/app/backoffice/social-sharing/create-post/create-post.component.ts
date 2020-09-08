import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from "@ngx-translate/core";
import { Article } from 'src/app/shared/interfaces/article.type';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { BackofficeArticleService } from '../../shared/services/backoffice-article.service';
import { UploadFile } from 'ng-zorro-antd/upload';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { BackofficeSocialSharingService } from '../../shared/services/backoffice-social-sharing.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {

  current = 0;
  postForm: FormGroup;
  file: any;
  articleImage;
  imageTypeErrorMsg: string = "";
  imageSizeErrorMsg: string = "";
  imageGeneralErrorMsg: string = "";
  origin: string;
  authorSlug: string;
  selectedStoryURL: string;
  index = 'First-content';
  articleList = {
    currentUser: [],
    companies: [],
    charities: []
  };
  lastVisible: any = null;
  userDetails;
  loading: boolean = true;
  isFormSaving: boolean = false;
  postData;

  constructor(
    public authService: AuthService,
    private articleService: BackofficeArticleService,
    public socialSharingService: BackofficeSocialSharingService,
    private fb: FormBuilder,
    private modalService: NzModalService,
    private msg: NzMessageService,
    public translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.postForm = this.fb.group({
      title: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(70)]],
      article_slug: [null, [Validators.required]],
      post_text: [null, [Validators.required, Validators.minLength(10)]]
    });

    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;
      this.userDetails = await this.authService.getLoggedInUserDetails();
      if (this.userDetails) {
        this.origin = window.location.origin;
        this.authorSlug = this.userDetails.slug;
        this.articleService.getAllArticles(this.userDetails.id).subscribe((data) => {
          this.articleList.currentUser = data;
          this.loading = false;
        }, err => {
          this.loading = false;
        });
      }
    })
  }

  pre(): void {
    this.current -= 1;
    this.changeContent();
  }

  next(): void {
    for (const i in this.postForm.controls) {
      this.postForm.controls[i].markAsDirty();
      this.postForm.controls[i].updateValueAndValidity();
    }

    if(this.current == 0) {
      if(this.postForm.valid) { 
        this.isFormSaving = true;
        this.selectedStoryURL = `${this.origin}/${this.authorSlug}/${this.postForm.value.article_slug}`;
        this.postData = JSON.parse(JSON.stringify(this.postForm.value));
        this.postData['story_url'] = this.selectedStoryURL;
        this.postData['image'] = this.articleImage;
        delete this.postData.article_slug;
        if (this.file) {
          this.socialSharingService.addPostImage(this.getImageObject()).then((data: any) => {
            this.postData.image = data.image;
            this.changeCurrent(1);
            this.isFormSaving = false;
          }).catch(err => {
            this.isFormSaving = false;
          });
        } else {
          this.changeCurrent(1);
          this.isFormSaving = false;
        }
      }
    } else {
      this.changeCurrent(1);
    }
  }

  changeCurrent(counter: number) {
    this.current += counter;
    this.changeContent();
  }

  done(): void {
    console.log('done');
  }

  changeContent(): void {
    switch (this.current) {
      case 0: {
        this.index = 'First-content';
        break;
      }
      case 1: {
        this.index = 'Second-content';
        break;
      }
      case 2: {
        this.index = 'third-content';
        break;
      }
      default: {
        this.index = 'error';
      }
    }
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

  private getBase64(img, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  getImageObject() {
    return {
      file: this.file
    }
  }
  getUpdatedObject() {
    return {
      image: { url: this.articleImage }
    }
  }

}
