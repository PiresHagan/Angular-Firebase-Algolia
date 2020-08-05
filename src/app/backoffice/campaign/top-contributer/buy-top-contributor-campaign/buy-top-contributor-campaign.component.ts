import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UploadFile, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/shared/services/language.service';
import { Language } from 'src/app/shared/interfaces/language.type';
import { CampaignService } from 'src/app/backoffice/shared/services/campaign.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TOPCONTRIBUTORCAMPAIGN } from 'src/app/shared/constants/campaign-constants';
import { UserService } from 'src/app/shared/services/user.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-buy-top-contributor-campaign',
  templateUrl: './buy-top-contributor-campaign.component.html',
  styleUrls: ['./buy-top-contributor-campaign.component.css']
})
export class BuyTopContributorCampaignComponent implements OnInit {

  topContributorForm: FormGroup;
  avatarImage;
  avatarImageObj;
  loading: boolean = false;
  isFormSaving: boolean = false;
  languageList: Language[];
  isProfilePicRequiredErr: boolean = false;
  price;
  campaignData;
  campaignId: string;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private modal: NzModalService,
    private languageService: LanguageService,
    private campaignService: CampaignService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {
    this.topContributorForm = this.fb.group({
      lang: ['', [Validators.required]],
      sortBio: ['', [Validators.required, Validators.minLength(10)]],
      campaignDate: ['', [Validators.required]],

    });
  }

  ngOnInit(): void {

    this.setUserDetails()

    this.languageList = this.languageService.geLanguageList();
    this.campaignService.getProductPrice(TOPCONTRIBUTORCAMPAIGN).subscribe((data: any) => {
      this.price = data[0].price;
    })

    this.campaignId = this.activatedRoute.snapshot.queryParams['campaign'];
    if (this.campaignId) {
      this.campaignService.getCampaignInfo(this.campaignId).subscribe((data: any) => {
        this.campaignData = data;
        this.setFomData();
      }, error => {
        this.router.navigate(['app/campaign/campaign-manager']);
      })
    }

  }
  setFomData() {
    this.topContributorForm.setValue({
      lang: this.campaignData.language,
      sortBio: this.campaignData.sortBio,
      campaignDate: new Date(this.campaignData.campaignDate)

    });
    this.avatarImageObj = this.campaignData.avatarImage;
    this.avatarImage = this.campaignData.avatarImage.url;
  }



  beforeUpload = (file: UploadFile, _fileList: UploadFile[]) => {
    this.loading = true;
    let $errorLbl = this.translate.instant("CampERROR");
    let $OkBtn = this.translate.instant("CampOK");
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      this.loading = false;
      this.showImageError($errorLbl, this.translate.instant("artImageTypeErr"), $OkBtn);
      return false;
    }

    const isLt2M = file.size! / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.loading = false;
      this.showImageError($errorLbl, this.translate.instant("artImageSizeErr"), $OkBtn);

      return false;
    }
    this.avatarImageObj = file;
    try {
      this.getBase64(file, (img: string) => {
        this.avatarImage = img;
        this.campaignService.uploadImage(this.getImageObject()).then((imageData) => {
          this.loading = false;
          this.isProfilePicRequiredErr = false;
          this.avatarImageObj = imageData;
        }).catch(() => {
          this.loading = false;
          this.isProfilePicRequiredErr = true;
          this.showImageError($errorLbl, this.translate.instant("artImageGeneralErr"), $OkBtn);
        })
      });
    } catch (error) {
      this.loading = false;
      this.avatarImageObj = null;
      this.avatarImage = null;
      this.showImageError($errorLbl, this.translate.instant("artImageGeneralErr"), $OkBtn);
    }

    return false;
  };


  submitForm(value): void {

    for (const key in this.topContributorForm.controls) {
      this.topContributorForm.controls[key].markAsDirty();
      this.topContributorForm.controls[key].updateValueAndValidity();
    }

    if (!this.avatarImageObj) {
      this.isProfilePicRequiredErr = true;
      return;
    }

    const formDetails = {
      language: value.lang,
      sortBio: value.sortBio,
      avatarImage: this.avatarImageObj,
      campaignDate: value.campaignDate.toISOString(),

    }
    console.log(formDetails);
    this.buyTopContributorSpot(formDetails)
  }
  private getBase64(img, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: UploadFile }): void {

  }

  buyTopContributorSpot(formDetails) {
    this.isFormSaving = true;
    this.campaignService.buyTopContributorSpot(formDetails, this.campaignId).subscribe((response: any) => {
      this.isFormSaving = false;
      this.router.navigate(['app/campaign/checkout-top-contributor', response.campaignId]);
    }, (error) => {
      this.isFormSaving = false;
      let $errorLbl = this.translate.instant("CampERROR");
      let $OkBtn = this.translate.instant("CampOK");
      this.modal.error({
        nzTitle: $errorLbl,
        nzContent: this.translate.instant("SomethingWentWrong1"),
        nzOnOk: () => $OkBtn
      });


    })
  }
  getImageObject() {
    return {
      file: this.avatarImageObj,
      alt: '',
    }
  }
  showImageError($errorLbl, message, btn) {
    this.modal.error({
      nzTitle: $errorLbl,
      nzContent: '<p>' + message + '</p>',
      nzOnOk: () => btn
    });
  }

  setUserDetails() {
    this.userService.getCurrentUser().then((user) => {
      this.userService.getMember(user.uid).subscribe((memberDetails) => {

        if (memberDetails && memberDetails.avatar && memberDetails.avatar.url) {
          this.avatarImageObj = memberDetails.avatar;
          this.avatarImage = memberDetails.avatar.url;
          this.isProfilePicRequiredErr = false;
        }

      })

    })
  }


}
