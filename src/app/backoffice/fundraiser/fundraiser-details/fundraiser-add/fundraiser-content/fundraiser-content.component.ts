import { Component, OnInit } from '@angular/core';
import { Fundraiser } from 'src/app/shared/interfaces/fundraiser.type';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService, LangChangeEvent } from "@ngx-translate/core";
import { AuthService } from 'src/app/shared/services/authentication.service';
import { UserService } from 'src/app/shared/services/user.service';
import { NzModalService, UploadFile } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { DRAFT } from 'src/app/shared/constants/status-constants';
import { LanguageService } from 'src/app/shared/services/language.service';
import { Location } from '@angular/common';
import { BackofficeFundraiserService } from 'src/app/backoffice/shared/services/backoffice-fundraiser.service';
// import { AUDIO, VIDEO, TEXT } from 'src/app/shared/constants/article-constants';
import { DomSanitizer } from '@angular/platform-browser';
import { CompanyService } from 'src/app/backoffice/shared/services/company.service';
import { CharityService } from 'src/app/backoffice/shared/services/charity.service';
import { AUTHOR } from 'src/app/shared/constants/member-constant';

@Component({
  selector: 'app-fundraiser-content',
  templateUrl: './fundraiser-content.component.html',
  styleUrls: ['./fundraiser-content.component.scss']
})

export class FundraiserContentComponent implements OnInit {

  tagList: [] = [];
  tagValue = [];
  fundraiser: Fundraiser = null;
  fundraiserForm: any;
  contentValidation: boolean = false;
  isLoggedInUser: boolean = false;
  userDetails;
  fundraiserId: string;
  isFormSaving: boolean = false;
  loading: boolean = true;
  isLogoImageUploading = false;
  languageList;
  // radioValue = 'text';
  // allowedFundraiserVideo = ['mimetypes:video/x-ms-asf', 'video/x-flv', 'video/mp4', 'application/x-mpegURL', 'video/MP2T', 'video/3gpp', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv', 'video/avi'];
  // allowedFundraiserAudio = ['audio/mpeg'];
  fundraiserFile;
  // videoFile;
  // audioFile;
  logoImage;
  fileURL: string;
  // videofileURL: string;
  // audioFileUrl: string;
  // VIDEO = VIDEO;
  // AUDIO = AUDIO;
  // TEXT = TEXT;
  authorList;

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
    public translate: TranslateService,
    public authService: AuthService,
    public userService: UserService,
    public fundraiserService: BackofficeFundraiserService,
    private modalService: NzModalService,
    private router: Router,
    private route: ActivatedRoute,
    private languageService: LanguageService,
    private location: Location,
    private sanitizer: DomSanitizer,
    private charityService: CharityService,
    private companyService: CompanyService
  ) {
    this.fundraiserForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$")]],
      phone: ['', [Validators.required, Validators.maxLength(10)]],
      goal_amount: [null, [Validators.required, Validators.min(1)]],
      color_code: ['', [Validators.pattern("^[#0-9a-f]{7}$")]],
      title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(70)]],
      excerpt: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(160)]],
      content: ['', [Validators.minLength(10)]],
      lang: ['', [Validators.required]],
      type: ['fundraiser'],
      author: ['', [Validators.required]]
    });
  }

  // isValidVideo(mimeType) {
  //   return this.allowedFundraiserVideo.indexOf(mimeType) > -1;
  // }

  // isValidAudio(mimeType) {
  //   return this.allowedFundraiserAudio.indexOf(mimeType) > -1;
  // }

  // isValidSize(fileSize, requiredSize) {
  //   return fileSize! / 1024 / 1024 < requiredSize
  // }

  showMessage(msg, type, extras = '') {
    if (type == 'error') {
      this.modalService.error({
        nzTitle: this.translate.instant("CampERROR"),
        nzContent: this.translate.instant(msg) + extras
      })
    } else if (type == 'warning') {
      this.modalService.warning({
        nzTitle: this.translate.instant("CampWarning"),
        nzContent: this.translate.instant(msg) + extras
      })

    } else if (type == 'success') {
      this.modalService.warning({
        nzTitle: this.translate.instant("CampSuccess"),
        nzContent: this.translate.instant(msg) + extras
      })

    }
  }

  private getBase64(img: File, callback: (img: {}) => void): void {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  saveImageOnServer(base64, name) {
    return this.fundraiserService.addImage(base64, name)
  }
  
  // beforeUpload = (file: UploadFile, _fileList: UploadFile[]) => {
  //   const isValidFile = this.fundraiserType == AUDIO ? this.isValidAudio(file.type) : this.isValidVideo(file.type);
  //   if (!isValidFile) {
  //     this.showMessage('InvalidFormat', 'error');
  //     return false;
  //   }

  //   const validSize = this.fundraiserType == AUDIO ? this.isValidSize(file.size, 100) : this.isValidSize(file.size, 100);
  //   if (!validSize) {
  //     this.showMessage('InvalidSize', 'error', this.fundraiserType == AUDIO ? '100MB' : '100MB');
  //     return false;
  //   }

  //   this.fundraiserFile = file;
  //   return false;
  // };

  beforeUploadLogo = (file: UploadFile, _fileList: UploadFile[]) => {
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

  async ngOnInit() {

    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;
      this.userDetails = await this.authService.getLoggedInUserDetails();
      this.languageList = this.languageService.geLanguageList();

      let fundraiserId = this.route.snapshot.queryParams["fundraiser"];

      if (fundraiserId) {
        try {
          this.fundraiser = await this.fundraiserService.getFundraiserById(fundraiserId);
          if (this.fundraiser && (this.fundraiser['id'])) {
            this.setFormDetails();
            this.getCompanyAndCharity(this.fundraiser.author);
            this.loading = false;
          }
        } catch (error) {
          this.fundraiser = null;
        }
      } else {
        this.getCompanyAndCharity(this.userDetails.id);
        this.loading = false;
      }
    })
  }

  submitFundraiser() {
    if (!this.logoImage) {
      this.showWarningMessage("LogoImageRequired");
      return
    }

    for (const i in this.fundraiserForm.controls) {
      this.fundraiserForm.controls[i].markAsDirty();
      this.fundraiserForm.controls[i].updateValueAndValidity();
    }

    if (this.findInvalidControls().length == 0) {
      this.isFormSaving = true;
      const fundraiserData = {
        email: this.fundraiserForm.get('email').value,
        phone: this.fundraiserForm.get('phone').value,
        goal_amount: this.fundraiserForm.get('goal_amount').value,
        color_code: this.fundraiserForm.get('color_code').value,
        content: this.fundraiserForm.get('content').value,
        title: this.fundraiserForm.get('title').value,
        slug: this.getSlug(this.fundraiserForm.get('title').value.trim()),
        excerpt: this.fundraiserForm.get('excerpt').value,
        author: this.getUserDetails(this.fundraiserForm.get('author').value),
        summary: this.fundraiserForm.get('title').value,
        status: this.fundraiser && this.fundraiser.status ? this.fundraiser.status : DRAFT,
        lang: this.fundraiserForm.get('lang').value ? this.fundraiserForm.get('lang').value : this.userDetails.lang,
        type: this.fundraiserForm.get('type').value,
        logo: this.logoImage,
        fundraising_file: this.fundraiser ? this.fundraiser.fundraising_file : {},
        created_at: this.fundraiser && this.fundraiser.id && this.fundraiser.created_at ? this.fundraiser.created_at : new Date().toISOString()
      }
      if (this.fundraiserFile) {
        this.fundraiserService.uploadFundraiserFile(this.fundraiserFile).then(data => {
          fundraiserData['fundraising_file'] = data;
          this.addOrUpdateFundraiser(fundraiserData);
        })
      } else {
        // if (this.fundraiserType == "text")
          fundraiserData['fundraising_file'] = null;
        this.addOrUpdateFundraiser(fundraiserData);
      }

    }
    console.log(this.fundraiserForm)
  }
  resetAndNavigate(fundraiser = null) {
    this.fundraiserId = fundraiser ? fundraiser.fundraisingId : this.fundraiser.id;
    this.isFormSaving = false;
    this.router.navigate(['app/fundraiser/fundraiser-details/image', this.fundraiserId]);
    this.fundraiserForm.reset();
  }

  findInvalidControls() {
    const invalid = [];
    const controls = this.fundraiserForm.controls;
    for (const name in controls) {

      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    this.contentValidation = false;
    if (!this.fundraiserForm.controls['content'].value) {
      this.contentValidation = true;
      invalid.push('content');
    }
    // if (this.fundraiserType == 'audio') {
    //   if (!this.fundraiserFile && !this.fundraiser) {
    //     this.contentValidation = true;
    //     invalid.push('audio');
    //   } else if (!this.fundraiserFile && this.fundraiser && !this.fundraiser.fundraising_file) {
    //     this.contentValidation = true;
    //     invalid.push('audio');
    //   } else if (!this.fundraiserFile && this.fundraiser && this.fundraiser.fundraising_file && this.fundraiser.type !== 'audio') {
    //     this.contentValidation = true;
    //     invalid.push('audio');
    //   }
    // } else if (this.fundraiserType == 'video') {
    //   if (!this.fundraiserFile && !this.fundraiser) {
    //     this.contentValidation = true;
    //     invalid.push('video');
    //   } else if (!this.fundraiserFile && this.fundraiser && !this.fundraiser.fundraising_file) {
    //     this.contentValidation = true;
    //     invalid.push('video');
    //   } else if (!this.fundraiserFile && this.fundraiser && this.fundraiser.fundraising_file && this.fundraiser.type !== 'video') {
    //     this.contentValidation = true;
    //     invalid.push('video');
    //   }
    // }
    return invalid;
  }
  getSlug(title: string) {
    return title.replace(/ /g, '-')?.toLowerCase();
  }

  getUserDetails(userDetails) {
    if (!userDetails)
      userDetails = this.userDetails;
    return {
      slug: userDetails.slug ? userDetails.slug : '',
      fullname: userDetails.fullname || userDetails.name,
      avatar: {
        url: userDetails.avatar?.url || userDetails.logo?.url,
        alt: userDetails.avatar?.alt || userDetails.logo?.alt
      },
      type: userDetails.type ? userDetails.type : AUTHOR,
      id: userDetails.id
    }
  }

  showSuccess(): void {
    let $message = this.translate.instant("fundraiserSave");
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      $message = this.translate.instant("fundraiserSave");
    })
    this.modalService.success({
      nzTitle: "<i>" + $message + "</i>",
    });
  }
  showError(): void {
    this.isFormSaving = false;
    let $message = this.translate.instant("fundraiserError");
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      $message = this.translate.instant("fundraiserError");
    })
    this.modalService.error({
      nzTitle: "<i>" + $message + "</i>",
    });
  }

  setFormDetails() {
    this.fundraiserForm.setValue({
      email: this.fundraiser.email,
      phone: this.fundraiser.phone,
      goal_amount: this.fundraiser.goal_amount,
      color_code: this.fundraiser.color_code,
      title: this.fundraiser.title,
      excerpt: this.fundraiser.excerpt,
      content: this.fundraiser.content,
      lang: this.fundraiser.lang,
      type: this.fundraiser.type,
      author: this.fundraiser.author ? this.fundraiser.author : null
    });
    this.logoImage = this.fundraiser.logo;
    // this.audioFile = this.fundraiser.type === "audio" ? this.fundraiser.fundraising_file : '';
    // this.videoFile = this.fundraiser.type === "video" ? this.fundraiser.fundraising_file : '';
    // const format = this.fundraiser.type === "audio" ? 'mp3' : 'mp4';
    // this.videofileURL = this.fundraiser.type === "video" && `https://player.cloudinary.com/embed/?cloud_name=mytrendingstories&public_id=${this.fundraiser.fundraising_file.cloudinary_id}&fluid=true&controls=true&source_types%5B0%5D=${format}`
    // this.audioFileUrl = this.fundraiser.type === "audio" && `https://player.cloudinary.com/embed/?cloud_name=mytrendingstories&public_id=${this.fundraiser.fundraising_file.cloudinary_id}&fluid=true&controls=true&source_types%5B0%5D=${format}`
  }

  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  
  languageSelected(language: string) {
    if (!language)
      return
  }

  getCompanyAndCharity(userId: string) {
    this.authorList = {
      charities: [],
      companies: [],
      currentUser: this.userDetails
    }
    this.charityService.getAllCharities(this.userDetails.id, 1000).subscribe((charityData) => {
      this.authorList.charities = charityData.charityList;
      this.setAuthorDropdown();

    })

    this.companyService.getAllCompanies(this.userDetails.id, 1000).subscribe((companyData) => {
      this.authorList.companies = companyData.companyList;
      this.setAuthorDropdown();
    })
  }

  setAuthorDropdown() {
    let selectedUser = null;;
    if (this.fundraiser && this.fundraiser.author) {
      if (this.userDetails.id === this.fundraiser.author.id) {
        selectedUser = this.userDetails;
      }
      if (this.authorList.charities && this.authorList.charities.length) {
        selectedUser = this.getRecordFromId(this.authorList.charities, this.fundraiser.author.id) || null;
      }
      if (this.authorList.companies && this.authorList.companies.length) {
        selectedUser = this.getRecordFromId(this.authorList.companies, this.fundraiser.author.id) || null;
      }
      this.fundraiserForm.controls['author'].setValue(selectedUser)
    }
  }

  getRecordFromId(list, id) {
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      if (element.id == id) {
        return element;
      }
    }
    return null;
  }

  goBack() {
    this.location.back();
  }

  removeFile() {
    this.fundraiserFile = null;
    this.contentValidation = false;
  }

  addOrUpdateFundraiser(fundraiserData) {
    if (this.fundraiser && this.fundraiser.id)
      this.fundraiserService.updateFundraiser(this.fundraiser.id, fundraiserData).then(() => {
        this.resetAndNavigate();
      }).catch(() => {
        this.showError();
      })
    else
      this.fundraiserService.createFundraiser(fundraiserData).then((fundraiser: any) => {
        this.resetAndNavigate(fundraiser);
      }).catch(() => {
        this.showError();
      })
  }

  // get fundraiserType() { return this.fundraiserForm.get('type').value; }

}
