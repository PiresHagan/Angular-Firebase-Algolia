import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService, UploadFile, NzModalService } from 'ng-zorro-antd';
import { LanguageService } from 'src/app/shared/services/language.service';
import { Language } from 'src/app/shared/interfaces/language.type';
import { CampaignService } from 'src/app/backoffice/shared/services/campaign.service';
import { Router } from '@angular/router';

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
  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private modal: NzModalService,
    private languageService: LanguageService,
    private campaignService: CampaignService,
    private router: Router
  ) {
    this.searchEnineCampaignForm = this.fb.group({
      brandName: ['', [Validators.required]],
      brandURL: ['', [Validators.required]],
      campaignDate: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.languageList = this.languageService.geLanguageList();
  }


  beforeUpload = (file: UploadFile, _fileList: UploadFile[]) => {
    this.loading = true;
    let $errorLbl = this.translate.instant("CampERROR");
    let $OkBtn = this.translate.instant("CampOK");
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      this.loading = false;

      this.modal.error({
        nzTitle: $errorLbl,
        nzContent: '<p>' + this.translate.instant("artImageTypeErr") + '</p>',
        nzOnOk: () => $OkBtn
      });



      return false;
    }

    const isLt2M = file.size! / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.loading = false;
      this.modal.error({
        nzTitle: $errorLbl,
        nzContent: '<p>' + this.translate.instant("artImageSizeErr") + '</p>',
        nzOnOk: () => $OkBtn
      });

      return false;
    }
    this.brandImageObj = file;
    try {
      this.getBase64(file, (img: string) => {
        this.loading = false;
        this.isBrandPicRequiredErr = false;
        this.brandImage = img;
      });
    } catch (error) {
      this.loading = false;
      this.brandImageObj = null;
      this.brandImageObj = null;
      this.modal.error({
        nzTitle: $errorLbl,
        nzContent: '<p>' + this.translate.instant("artImageGeneralErr") + '</p>',
        nzOnOk: () => $OkBtn
      });
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
      campaignDate: value.campaignDate.toISOString()

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
    this.campaignService.buyBrandSpot(formDetails).subscribe((response: any) => {
      this.isFormSaving = false;
      this.router.navigate(['app/campaign/search-engine/checkout-search-engine', response.id]);
    }, (error) => {
      this.isFormSaving = false;
      let $errorLbl = this.translate.instant("CampERROR");
      let $OkBtn = this.translate.instant("CampOK");
      this.modal.error({
        nzTitle: $errorLbl,
        nzContent: '<p>' + error ? error.message : error.message + '</p>',
        nzOnOk: () => $OkBtn
      });


    })
  }


}
