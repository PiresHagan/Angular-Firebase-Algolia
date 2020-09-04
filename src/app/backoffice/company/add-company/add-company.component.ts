import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { NzModalService, UploadFile } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { LanguageService } from 'src/app/shared/services/language.service';
import { CompanyService } from '../../shared/services/company.service';
import { Company } from 'src/app/shared/interfaces/company.type';
import { AuthService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent implements OnInit {


  companyForm;
  companyDetails;
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
    private companyService: CompanyService,
    public authService: AuthService


  ) { }
  ngOnInit(): void {
    this.languageList = this.languageService.geLanguageList();
    this.createForm();
    this.getCompanyDetails();
  }

  createForm() {
    this.companyForm = this.fb.group({
      company_name: ['', [Validators.required, Validators.maxLength(70)]],
      company_email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      company_phone: ['', [Validators.required, Validators.maxLength(10)]],
      company_lang: ['', [Validators.required]],
      company_slug: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(70), Validators.pattern('^[a-z0-9-]+$')]],
      company_bio: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(250)]],
      company_presentation: ['', [Validators.required]],
      company_color_code: ['', [Validators.pattern("^[#0-9a-f]{7}$")]]
    });
  }
  setFormValues(companyDetails: Company) {

    this.companyForm.setValue({
      company_name: companyDetails.name,
      company_email: companyDetails.email,
      company_phone: companyDetails.phone,
      company_lang: companyDetails.lang,
      company_slug: companyDetails.slug,
      company_bio: companyDetails.bio,
      company_presentation: companyDetails.presentation,
      company_color_code: companyDetails.color_code ? companyDetails.color_code : "",
    });
    this.coverImage = companyDetails.cover;
    this.logoImage = companyDetails.logo;
    this.companyDetails = companyDetails;

  }

  async getCompanyDetails() {
    let companyId = this.activatedRoute.snapshot.queryParams["company"];
    const userDetails = await this.authService.getLoggedInUserDetails();
    if (!companyId)
      return;
    this.companyService.get(companyId, userDetails.id).subscribe((companyDetails: Company) => {
      if (companyDetails[0]) {
        this.setFormValues(companyDetails[0])
      } else {
        this.showErrorMessage('InvalidCompanyDetails');
        setTimeout(() => {
          this.backToList();
        }, 2000)
      }
    }, () => {
      this.showErrorMessage('InvalidCompanyDetails');
    })
  }

  backToList() {
    this.router.navigate(['app/company/company-list'])
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
      name: this.companyForm.value.company_name,
      email: this.companyForm.value.company_email,
      lang: this.companyForm.value.company_lang,
      phone: this.companyForm.value.company_phone,
      slug: this.companyForm.value.company_slug,
      bio: this.companyForm.value.company_bio,
      presentation: this.companyForm.value.company_presentation,
      color_code: this.companyForm.value.company_color_code,
      logo: this.logoImage,
      type: 'company',
      // author: await this.getUserDetails(),
      cover: this.coverImage,
      created_at: this.companyDetails && !this.companyDetails.id ? this.companyDetails.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    if (this.companyDetails && this.companyDetails.id) {
      this.updateCompany(formData);
    } else {
      this.addCompany(formData);
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


  addCompany(formData) {
    this.companyService.addCompany(formData).subscribe(() => {
      this.isFormSaving = false;
      this.showSuccessMessage('CompanyAdded');
      setTimeout(() => {
        this.router.navigate(['app/company/company-list'])
      }, 2000);
      return null;
    }, (error) => {
      this.isFormSaving = false;
      this.showSuccessMessage('SomethingWrong');
    })
  }

  updateCompany(formData) {
    this.companyService.updateCompany(formData, this.companyDetails.id).subscribe(() => {
      this.isFormSaving = false;
      this.showSuccessMessage('CompanyUpdated');
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
    return this.companyService.addImage(base64, name)
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
    for (const i in this.companyForm.controls) {
      this.companyForm.controls[i].markAsDirty();
      this.companyForm.controls[i].updateValueAndValidity();
    }
    const invalid = [];
    const controls = this.companyForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  get company(): Company {
    return this.companyDetails;
  }
  omit_special_char(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return (k != 47 && k != 92 && k != 124 && k != 60 && k != 62 && k != 94 && k != 126 && k != 96);

  }

}
