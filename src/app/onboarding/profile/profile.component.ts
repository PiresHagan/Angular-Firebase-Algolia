import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NzModalService, UploadFile } from 'ng-zorro-antd';
import { LanguageService } from 'src/app/shared/services/language.service';
import { UserService } from '../../shared/services/user.service';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { Language } from 'src/app/shared/interfaces/language.type';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  
  profileForm: FormGroup;
  avatarUrl: string = "";
  memberDetails;
  isPhotoChangeLoading: boolean = false;
  isFormSaving: boolean = false;
  currentUser: any;
  avatarData = null;
  languageList: Language[];
  selectedLanguage: string;
  userTypeList = [];
  loggedInUser;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: NzModalService,
    private userService: UserService,
    public translate: TranslateService,
    private authService: AuthService,
    private _location: Location,
    private language: LanguageService
  ) { }

  switchLang(lang: string) {
    this.language.changeLangOnBoarding(lang);
  }

  ngOnInit(): void {
    this.languageList = this.language.geLanguageList();
    this.selectedLanguage = this.language.defaultLanguage;

    this.profileForm = this.fb.group({
      user_type: [null, [Validators.required]],
      bio: [null, [Validators.required]]
    });
    this.setFormData();

    setTimeout(() => {
      this.userService.getUserTypeData().then( data => {
        this.userTypeList = data.user_types;
      });
    }, 2500)
  }

  backClicked() {
    this._location.back();
  }

  setFormData() {
    this.userService.getCurrentUser().then((user) => {


      this.userService.get(user.uid).subscribe((userDetails) => {
        this.currentUser = userDetails;
      });
      
      this.userService.getMember(user.uid).subscribe((memberDetails) => {
        this.avatarUrl = memberDetails?.avatar?.url;
        if (memberDetails?.avatar && memberDetails?.avatar?.url)
          this.avatarData = {
            url: memberDetails?.avatar?.url,
            alt: memberDetails?.avatar?.alt
          }

        if(memberDetails?.user_type) 
          this.profileForm.controls['user_type'].setValue(memberDetails?.user_type);

        if(memberDetails?.bio) 
          this.profileForm.controls['bio'].setValue(memberDetails?.bio);

        this.memberDetails = memberDetails;
      })

    })
  }

  async submitForm() {

    if (!this.currentUser)
      return;

    for (const i in this.profileForm.controls) {
      this.profileForm.controls[i].markAsDirty();
      this.profileForm.controls[i].updateValueAndValidity();
    }

    if (!this.avatarData) {
      this.modalService.warning({
        nzTitle: this.translate.instant("ProfileImageErrorTitle"),
        nzContent: this.translate.instant("ProfileImageErrorContent")
      });
      return
    }


    if (this.findInvalidControls().length == 0 || this.profileForm.get('later').value) {
      try {
        this.isFormSaving = true;
        const bio = this.profileForm.get('bio').value;
        const user_type = this.profileForm.get('user_type').value;
        const loggedInUser = this.authService.getLoginDetails();
        if (!loggedInUser)
          return;
        await this.userService.updateBasicDetails(this.currentUser.id,
          {
            bio: bio ? bio : '',
            user_type: user_type ? user_type : '',
            avatar: this.avatarData
          });
        this.isFormSaving = false;
        if(user_type == 'reader') {
          this.router.navigate(['/auth/onboarding/import-contact']);
        } else {
          this.router.navigate(['/auth/onboarding/website']);
        }
      } catch (error) {
        console.log(error);
      }

    }
  }

  private getBase64(img: File, callback: (img: {}) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: UploadFile }): void {
    if (!this.currentUser)
      return;
    this.isPhotoChangeLoading = true;
    this.getBase64(info.file.originFileObj, (img: string) => {
      this.avatarUrl = img;
      this.userService.addProfileImage(this.currentUser.id, img, info.file?.name).then((uploadedImage: any) => {
        this.isPhotoChangeLoading = false;
        this.avatarData = {
          url: uploadedImage.url,
          alt: uploadedImage.alt
        }
      }).catch(() => {
        this.isPhotoChangeLoading = false;
        console.log('Image not uploaded properly')
      });
    })
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.profileForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

}
