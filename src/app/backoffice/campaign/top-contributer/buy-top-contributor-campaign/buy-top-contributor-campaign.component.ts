import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UploadFile, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/shared/services/language.service';
import { Language } from 'src/app/shared/interfaces/language.type';
import { CampaignService } from 'src/app/backoffice/shared/services/campaign.service';
import { Router } from '@angular/router';

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


  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private modal: NzModalService,
    private languageService: LanguageService,
    private campaignService: CampaignService,
    private router: Router
  ) {
    this.topContributorForm = this.fb.group({
      lang: ['', [Validators.required]],
      sortBio: ['', [Validators.required, Validators.minLength(10)]],
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
    this.avatarImageObj = file;
    try {
      this.getBase64(file, (img: string) => {
        this.loading = false;
        this.isProfilePicRequiredErr = false;
        this.avatarImage = img;
      });
    } catch (error) {
      this.loading = false;
      this.avatarImageObj = null;
      this.avatarImage = null;
      this.modal.error({
        nzTitle: $errorLbl,
        nzContent: '<p>' + this.translate.instant("artImageGeneralErr") + '</p>',
        nzOnOk: () => $OkBtn
      });
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
      campaignDate: value.campaignDate
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
    this.campaignService.buyTopContributorSpot(formDetails).subscribe((response: any) => {
      this.isFormSaving = false;
      this.router.navigate(['app/campaign/top-contributor/checkout-top-contributor', response.id]);
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
