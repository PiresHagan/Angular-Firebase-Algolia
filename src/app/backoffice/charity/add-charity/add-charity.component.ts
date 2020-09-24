import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { NzModalService, UploadFile } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { LanguageService } from 'src/app/shared/services/language.service';
import { CharityService } from '../../shared/services/charity.service';
import { Charity } from 'src/app/shared/interfaces/charity.type';
import { AuthService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-add-charity',
  templateUrl: './add-charity.component.html',
  styleUrls: ['./add-charity.component.scss']
})
export class AddCharityComponent implements OnInit {


  charityForm;
  charityDetails;
  selectedFile;
  coverImage;
  logoImage;
  isFormSaving = false;
  isLogoImageUploading = false;
  isCoverImageUploading = false;
  loading = false;
  languageList
  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 2 }, { 'header': 3 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'align': [] }],
      ['link', 'image', 'video']
    ]
  };
  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private modalService: NzModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private languageService: LanguageService,
    private charityService: CharityService,
    public authService: AuthService,

  ) { }
  ngOnInit(): void {
    this.languageList = this.languageService.geLanguageList();
    this.createForm();
    this.getCharityDetails();
  }

  createForm() {
    this.charityForm = this.fb.group({
      charity_name: ['', [Validators.required, Validators.maxLength(70)]],
      charity_email: ['', [Validators.required, Validators.pattern("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$")]],
      charity_phone: ['', [Validators.required, Validators.maxLength(10)]],
      charity_lang: ['', [Validators.required]],
      charity_slug: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(70), Validators.pattern('^[a-z0-9-]+$')]],
      charity_bio: ['', [Validators.required, Validators.maxLength(250)]],
      charity_presentation: ['', [Validators.required]],
      charity_color_code: ['', [Validators.pattern("^[#0-9a-f]{7}$")]]
    });
  }
  setFormValues(charityDetails: Charity) {

    this.charityForm.setValue({
      charity_name: charityDetails.name,
      charity_email: charityDetails.email,
      charity_phone: charityDetails.phone,
      charity_lang: charityDetails.lang,
      charity_slug: charityDetails.slug,
      charity_bio: charityDetails.bio,
      charity_presentation: charityDetails.presentation,
      charity_color_code: charityDetails.color_code ? charityDetails.color_code : "",
    });
    this.coverImage = charityDetails.cover;
    this.logoImage = charityDetails.logo;
    this.charityDetails = charityDetails;

  }



  async getCharityDetails() {
    let charityId = this.activatedRoute.snapshot.queryParams["charity"];
    const userDetails = await this.authService.getLoggedInUserDetails();
    if (!charityId)
      return;
    this.charityService.get(charityId, userDetails.id).subscribe((charityDetails: Charity) => {
      if (charityDetails[0]) {
        this.setFormValues(charityDetails[0])
      } else {
        this.showErrorMessage('InvalidCharityDetails');
        setTimeout(() => {
          this.backToList();
        }, 2000)
      }

    }, () => {
      this.showErrorMessage('InvalidCharityDetails');
    })
  }

  backToList() {
    this.router.navigate(['app/charity/charity-list'])
  }

  submitDetails() {

    if (!this.logoImage) {
      this.showWarningMessage("LogoImageRequired");
      return
    }
    if (!this.coverImage) {
      this.showWarningMessage("CoverImageRequired");
      return
    }
    const invalidFields = this.validateAllFields();
    if (invalidFields.length) {
      this.showWarningMessage("PleaseCheckAllFields");
      return;
    }



    this.isFormSaving = true;

    const formData = {
      name: this.charityForm.value.charity_name,
      email: this.charityForm.value.charity_email,
      lang: this.charityForm.value.charity_lang,
      phone: this.charityForm.value.charity_phone,
      slug: this.charityForm.value.charity_slug,
      bio: this.charityForm.value.charity_bio,
      presentation: this.charityForm.value.charity_presentation,
      color_code: this.charityForm.value.comany_color_code,
      logo: this.logoImage,
      type: 'charity',
      // author: await this.getUserDetails(),
      cover: this.coverImage,
      created_at: this.charityDetails && !this.charityDetails.id ? this.charityDetails.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    if (this.charityDetails && this.charityDetails.id) {
      this.updateCharity(formData);
    } else {
      this.addCharity(formData);
    }
  }

  async getUserDetails() {
    const userDetails = await this.authService.getLoggedInUserDetails();
    return {
      slug: userDetails.slug ? userDetails.slug : '',
      fullname: userDetails.fullname,
      avatar: {
        url: userDetails.avatar?.url ? userDetails.avatar?.url : '',
        alt: userDetails.avatar?.alt ? userDetails.avatar?.alt : ''
      },
      id: userDetails.id
    }
  }


  addCharity(formData) {
    this.charityService.addCharity(formData).subscribe(() => {
      this.isFormSaving = false;
      this.showSuccessMessage('CharityAdded');
      setTimeout(() => {
        this.router.navigate(['app/charity/charity-list'])
      }, 2000);
      return null;
    }, (error) => {
      this.isFormSaving = false;
      this.showSuccessMessage('SomethingWrong');
    })
  }

  updateCharity(formData) {
    this.charityService.updateCharity(formData, this.charityDetails.id).subscribe(() => {
      this.isFormSaving = false;
      this.showSuccessMessage('CharityUpdated');
    }, (error) => {
      this.isFormSaving = false;
      this.showSuccessMessage('SomethingWrong');
    })
  }


  showSuccessMessage(message) {
    let $message = this.translate.instant(message);
    this.modalService.success({
      nzTitle: $message,
    });

  }

  showErrorMessage(message) {
    let $message = this.translate.instant(message);
    this.modalService.error({
      nzTitle: $message,
    });
  }

  showWarningMessage(message) {
    let $message = this.translate.instant(message);
    this.modalService.warning({
      nzTitle: $message,
    });
  }

  saveImageOnServer(base64, name) {
    this.loading = true;
    return this.charityService.addImage(base64, name)
  }

  private getBase64(img: File, callback: (img: {}) => void): void {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  beforeUpload = (file: UploadFile, _fileList: UploadFile[]) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      this.showErrorMessage("artImageTypeErr");
      return false;
    }
    const isLt2M = file.size! / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.showErrorMessage("artImageSizeErr");
      return false;
    }
    return true;
  };

  handleChange(info: { file: UploadFile }): void {
    try {
      this.isLogoImageUploading = true;
      this.getBase64(info.file.originFileObj, (img: string) => {
        this.saveImageOnServer(img, info.file.name).then((imageObject) => {
          this.logoImage = imageObject;
          this.isLogoImageUploading = false;
        })
      })
    } catch (error) {
      this.isLogoImageUploading = false;
      this.showErrorMessage('artImageGeneralErr');
    }
  }
  handleCoverImageChange(info: { file: UploadFile }): void {
    try {
      this.isCoverImageUploading = true;
      this.getBase64(info.file.originFileObj, (img: string) => {
        this.saveImageOnServer(img, info.file.name).then((imageObject) => {
          this.coverImage = imageObject;
          this.isCoverImageUploading = false;
        })
      })
    } catch (error) {
      this.isCoverImageUploading = false;
      this.showErrorMessage('artImageGeneralErr')
    }
  }

  validateAllFields() {
    for (const i in this.charityForm.controls) {
      this.charityForm.controls[i].markAsDirty();
      this.charityForm.controls[i].updateValueAndValidity();
    }
    const invalid = [];
    const controls = this.charityForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  omit_special_char(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return (k != 47 && k != 92 && k != 124 && k != 60 && k != 62 && k != 94 && k != 126 && k != 96);

  }
}
