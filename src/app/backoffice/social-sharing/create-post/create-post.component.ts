import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from "@ngx-translate/core";
import { Router } from '@angular/router';
import { Article } from 'src/app/shared/interfaces/article.type';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { BackofficeArticleService } from '../../shared/services/backoffice-article.service';
import { UploadFile } from 'ng-zorro-antd/upload';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { BackofficeSocialSharingService } from '../../shared/services/backoffice-social-sharing.service';
import { Post } from 'src/app/shared/interfaces/social-sharing-post.type';
import { SocialSharingConstant } from 'src/app/shared/constants/social-sharing-constant';
import { CompanyService } from '../../shared/services/company.service';
import { Company } from 'src/app/shared/interfaces/company.type';
import { Charity } from 'src/app/shared/interfaces/charity.type';
import { CharityService } from '../../shared/services/charity.service';
import * as moment from 'moment';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {

  current = 0;
  postForm: FormGroup;
  datePickerForm: FormGroup;
  file: any;
  articleImage;
  imageTypeErrorMsg: string = "";
  imageSizeErrorMsg: string = "";
  imageGeneralErrorMsg: string = "";
  origin: string;
  index = 'First-content';
  articleList = {
    currentUser: [],
    companies: [],
    charities: []
  };
  userNetworks = [];
  lastVisible: any = null;
  userDetails;
  loading: boolean = true;
  isFormSaving: boolean = false;
  postData: Post;
  scheduledDateTime;
  timeZoneValue;

  constructor(
    public authService: AuthService,
    private router: Router,
    private articleService: BackofficeArticleService,
    public socialSharingService: BackofficeSocialSharingService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalService,
    public translate: TranslateService,
    private companyService: CompanyService,
    private charityService: CharityService,
    private socialSharigService: BackofficeSocialSharingService
  ) { }

  ngOnInit(): void {
    this.timeZoneValue = new Date().toString().slice(new Date().toString().search('GMT'));
    this.origin = window.location.origin;

    this.postForm = this.fb.group({
      title: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(70)]],
      story_url: [null, [Validators.required]],
      post_text: [null, [Validators.required, Validators.minLength(10)]],
      image: [null]
    });

    this.datePickerForm = this.fb.group({
      scheduled_date: [null, [Validators.required]]
    });

    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;
      this.userDetails = await this.authService.getLoggedInUserDetails();
      if (this.userDetails) {
        this.articleService.getAllArticles(this.userDetails.id).subscribe((data) => {
          this.articleList.currentUser = data;
        }, err => {
          console.error(err);
        });

        this.companyService.getCompaniesByOwner(this.userDetails.id).subscribe(companyList => {
          companyList.forEach((company: Company) => {
            this.articleService.getAllArticles(company.id).subscribe((companyArticleList) => {
              companyArticleList.forEach(article => {
                this.articleList.companies.push(article);
              });
            }, err => {
              console.error(err);
            });
          });
        });

        this.charityService.getCharitiesByOwner(this.userDetails.id).subscribe(charityList => {
          charityList.forEach((charity: Charity) => {
            this.articleService.getAllArticles(charity.id).subscribe((charityArticleList) => {
              charityArticleList.forEach(article => {
                this.articleList.charities.push(article);
              });
              this.loading = false;
            }, err => {
              console.error(err);
              this.loading = false;
            });
          });
        });

        this.authService.get(this.userDetails.id).subscribe(data => {
          if(data[SocialSharingConstant.KEY_FACEBOOK])
            this.userNetworks.push(data[SocialSharingConstant.KEY_FACEBOOK]);
          if(data[SocialSharingConstant.KEY_LINKDIN])
            this.userNetworks.push(data[SocialSharingConstant.KEY_LINKDIN]);
          if(data[SocialSharingConstant.KEY_TWITTER])
            this.userNetworks.push(data[SocialSharingConstant.KEY_TWITTER]);
        });
      }
    })
  }

  pre(): void {
    this.changeCurrent(-1);
  }

  next(): void {
    for (const i in this.postForm.controls) {
      this.postForm.controls[i].markAsDirty();
      this.postForm.controls[i].updateValueAndValidity();
    }

    if(this.current == 0) {
      if(this.postForm.valid) { 
        this.isFormSaving = true;
        this.postData = JSON.parse(JSON.stringify(this.postForm.value));
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
    for (const i in this.datePickerForm.controls) {
      this.datePickerForm.controls[i].markAsDirty();
      this.datePickerForm.controls[i].updateValueAndValidity();
    }

    if(this.datePickerForm.valid) {
      this.postData.scheduled_date = new Date(this.scheduledDateTime).toISOString();
      this.confirmPostSubmission();
    }
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
      this.showMessage("error", this.imageTypeErrorMsg);
      return false;
    }

    const isLt2M = file.size! / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.showMessage("error", this.imageSizeErrorMsg);
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
      this.showMessage("error", this.imageGeneralErrorMsg);
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

  getStoryURL(story: Article) {
    const url = `${this.origin}/${story?.author?.slug}/${story?.slug}`;
    return url;
  }

  showMessage(type: string, message: string) {
    this.message.create(type, message);
  }

  confirmPostSubmission() {
    this.translate.get("PostSubmissionConf").subscribe((text:string) => {
      const title = text;
      this.modal.confirm({
        nzTitle: title,
        nzOnOk: () =>
          new Promise((resolve, reject) => {
            this.socialSharigService.addNewPost(this.postData).then(() => {
              this.showMessage('success', this.translate.instant("PostCreated"));
              resolve()
              this.router.navigate(['/app/social-sharing/post-list'])
            }, error => {
              reject(error)
            });
          }).catch((err) => {
            this.showMessage('error', err.message);
          })
      });
    });
  }

}
