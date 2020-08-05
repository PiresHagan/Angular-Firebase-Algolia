import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService, UploadFile, NzModalService } from 'ng-zorro-antd';
import { LanguageService } from 'src/app/shared/services/language.service';
import { Language } from 'src/app/shared/interfaces/language.type';
import { CampaignService } from 'src/app/backoffice/shared/services/campaign.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SEARCHENGINECAMPAIGN } from 'src/app/shared/constants/campaign-constants';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-buy-search-engine-campaign',
  templateUrl: './buy-search-engine-campaign.component.html',
  styleUrls: ['./buy-search-engine-campaign.component.css']
})
export class BuySearchEngineCampaignComponent implements OnInit {

  searchEnineCampaignForm: FormGroup;
  brandImage;
  brandImageObj;
  loading: boolean = false;
  isFormSaving: boolean = false;
  languageList: Language[];
  isBrandPicRequiredErr: boolean = false;
  price;
  campaignId;
  campaignData;
  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private modal: NzModalService,
    private languageService: LanguageService,
    private campaignService: CampaignService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)/;
    this.searchEnineCampaignForm = this.fb.group({
      brandName: ['', [Validators.required]],
      brandURL: ['', [Validators.required, Validators.pattern(urlRegex)]],
      campaignDate: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.languageList = this.languageService.geLanguageList();
    this.campaignService.getProductPrice(SEARCHENGINECAMPAIGN).subscribe((data: any) => {
      this.price = data[0].price;
    });

    this.campaignId = this.activatedRoute.snapshot.queryParams['campaign'];
    if (this.campaignId) {
      this.campaignService.getCampaignInfo(this.campaignId).subscribe((data: any) => {
        this.campaignData = data;
        this.setFomData();
      }, error => {
        this.router.navigate(['app/campaign/campaign-manager']);
      });
    }


  }
  setFomData() {
    this.searchEnineCampaignForm.setValue({
      brandName: this.campaignData.brandName,
      brandURL: this.campaignData.brandUrl,
      campaignDate: new Date(this.campaignData.campaignDate)
    });
    this.brandImage = this.campaignData.brandImage.url;
    this.brandImageObj = this.campaignData.brandImage;
    this.isBrandPicRequiredErr = false;
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
    this.brandImageObj = file;
    try {
      this.getBase64(file, (img: string) => {
        this.brandImage = img;
        this.campaignService.uploadImage(this.getImageObject()).then((imageData) => {
          this.loading = false;
          this.isBrandPicRequiredErr = false;
          this.brandImageObj = imageData;
        }).catch(() => {
          this.loading = false;
          this.isBrandPicRequiredErr = true;
          this.showImageError($errorLbl, this.translate.instant("artImageGeneralErr"), $OkBtn);
        })
      });
    } catch (error) {
      this.loading = false;
      this.brandImageObj = null;
      this.brandImageObj = null;
      this.showImageError($errorLbl, this.translate.instant("artImageGeneralErr"), $OkBtn);

    }

    return false;
  };


  submitForm(value): void {

    for (const key in this.searchEnineCampaignForm.controls) {
      this.searchEnineCampaignForm.controls[key].markAsDirty();
      this.searchEnineCampaignForm.controls[key].updateValueAndValidity();
    }

    if (!this.brandImageObj) {
      this.isBrandPicRequiredErr = true;
      return;
    }

    const formDetails = {
      brandName: value.brandName,
      brandUrl: value.brandURL,
      brandImage: this.brandImageObj,
      campaignDate: value.campaignDate.toISOString(),

    }
    console.log(formDetails);
    this.buySearchengineSpot(formDetails);
  }
  private getBase64(img, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: UploadFile }): void {

  }
  buySearchengineSpot(formDetails) {
    this.isFormSaving = true;
    this.campaignService.buyBrandSpot(formDetails, this.campaignId).subscribe((response: any) => {
      this.isFormSaving = false;
      this.router.navigate(['app/campaign/checkout-search-engine', response.campaignId]);
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
      file: this.brandImageObj,
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


}
