import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadFile } from 'ng-zorro-antd/upload';
import { TranslateService, LangChangeEvent } from "@ngx-translate/core";
import { NzModalService } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { BackofficeFundraiserService } from 'src/app/backoffice/shared/services/backoffice-fundraiser.service';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-fundraiser-image',
  templateUrl: './fundraiser-image.component.html',
  styleUrls: ['./fundraiser-image.component.scss']
})

export class FundraiserImageComponent implements OnInit {
  file: any;;
  fundraiserImage;
  fundraiserId: string;
  alternative: string = "";
  title: string = "";
  imageTypeErrorMsg: string = "";
  imageSizeErrorMsg: string = "";
  imageGeneralErrorMsg: string = "";
  isFormSaving: boolean = false;
  userDetails: any;
  loading: boolean = true;
  fundraiser: any;

  constructor(
    private msg: NzMessageService,
    public translate: TranslateService,
    public authService: AuthService,
    public userService: UserService,
    public fundraiserService: BackofficeFundraiserService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.fundraiserId = params.get('fundraiserId');
      this.setFundraiserData();
    });

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.imageTypeErrorMsg = this.translate.instant("fundraiserImageTypeErr");
      this.imageSizeErrorMsg = this.translate.instant("fundraiserImageSizeErr");;
      this.imageGeneralErrorMsg = this.translate.instant("fundraiserImageGeneralErr");
    })
  }

  beforeUpload = (file: UploadFile, _fileList: UploadFile[]) => {
    this.imageTypeErrorMsg = this.translate.instant("fundraiserImageTypeErr");;
    this.imageSizeErrorMsg = this.translate.instant("fundraiserImageSizeErr");;

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
        this.fundraiserImage = img;
      });
    } catch (error) {
      this.file = null;
      this.msg.error(this.imageGeneralErrorMsg);
    }

    return false;
  };

  saveFundraiserImage() {
    if (!this.file && !this.fundraiserImage) {
      this.imageGeneralErrorMsg = this.translate.instant("fundraiserImageGeneralErr");;
      this.modalService.warning({
        nzTitle: "<i>" + this.imageGeneralErrorMsg + "</i>",
      });
      return;
    }

    this.isFormSaving = true;
    if (this.file) {
      this.fundraiserService.addFundraiserImage(this.fundraiserId, this.getImageObject()).then(() => {
        this.router.navigate(['app/fundraiser/fundraiser-details/seo', this.fundraiserId]);
        this.isFormSaving = false;
      })
    } else {
      this.fundraiserService.updateFundraiser(this.fundraiserId, this.getUpdatedObject()).then(() => {
        this.router.navigate(['app/fundraiser/fundraiser-details/seo', this.fundraiserId]);
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
      image: { url: this.fundraiserImage, alt: this.alternative }
    }
  }
  setFundraiserData() {
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;
      this.userDetails = await this.authService.getLoggedInUserDetails();
      if (this.fundraiserId) {
        try {
          this.fundraiser = await this.fundraiserService.getFundraiserById(this.fundraiserId);
          this.fundraiserImage = this.fundraiser && this.fundraiser.image && this.fundraiser.image.url ? this.fundraiser.image.url : '';
          this.alternative = this.fundraiser && this.fundraiser.image && this.fundraiser.image.alt ? this.fundraiser.image.alt : '';
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
