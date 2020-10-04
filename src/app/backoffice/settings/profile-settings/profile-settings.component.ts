import { Component } from "@angular/core";
import { UploadFile } from "ng-zorro-antd";
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { NzModalService } from "ng-zorro-antd";
import { NzMessageService } from "ng-zorro-antd";
import { UserService } from "src/app/shared/services/user.service";
import * as firebase from "firebase/app";
import "firebase/storage";
import { User } from "src/app/shared/interfaces/user.type";
import { formatDate } from "@angular/common";
import { TranslateService, LangChangeEvent } from "@ngx-translate/core";
import { Member } from "src/app/shared/interfaces/member.type";
import { CategoryService } from "src/app/shared/services/category.service";
import { LanguageService } from "src/app/shared/services/language.service";
import { AuthService } from 'src/app/shared/services/authentication.service';
import { ActivatedRoute } from "@angular/router";
import { AnalyticsService } from "src/app/shared/services/analytics/analytics.service";

@Component({
  templateUrl: "./profile-settings.component.html",
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent {
  changePWForm: FormGroup;
  categoriesArray = [];
  photoURL: string;
  selectedCountry: any;
  profileForm: FormGroup;
  interestForm: FormGroup;
  currentUserEmail: string;
  isLoading: boolean = false;
  isChangePassLoading: boolean = false;
  isNotificationLoading: boolean = false;
  currentUser: User;
  isPhotoChangeLoading: boolean = false;
  memberDetails: Member;
  userDetails: User;
  languageList;
  avatarData = null;
  showIncompleteProfileMessage = false;
  notificationConfigList = [

  ];

  constructor(
    private fb: FormBuilder,
    private modalService: NzModalService,
    private message: NzMessageService,
    private userService: UserService,
    public translate: TranslateService,
    public categoryService: CategoryService,
    public languageService: LanguageService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private analyticsService: AnalyticsService,
  ) { }

  ngOnInit(): void {

    if (this.route.snapshot.queryParams && this.route.snapshot.queryParams.incomplete)
      this.showIncompleteProfileMessage = true;



    this.languageList = this.languageService.geLanguageList();
    /**
     * Password Form
     */
    this.changePWForm = this.fb.group({
      newPassword: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
    }, { validator: this.passwordConfirming });

    /**
     * Profile Form
     */

    this.profileForm = this.fb.group({
      phone: [null, [Validators.required]],
      birth: [null],
      biography: [null, [Validators.required]],
      displayName: [null, [Validators.required]],
      lang: [null, [Validators.required]]
    });

    /**
     * Intrest List Form
     */
    this.interestForm;

    this.setFormsData();

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.notificationConfigList = [];
      this.interestForm = null;
      this.setIntrestForm(this.userDetails);
    })

  }
  setFormsData() {
    this.userService.getCurrentUser().then((user) => {
      this.currentUser = user;

      this.userService.get(user.uid).subscribe((userDetails) => {
        this.currentUserEmail = userDetails.email;
        this.setUserDetails(userDetails);
        this.userDetails = userDetails;

        this.setIntrestForm(userDetails);
      })
      this.userService.getMember(user.uid).subscribe((memberDetails) => {
        this.photoURL = memberDetails?.avatar?.url ? memberDetails?.avatar?.url.replace('http://', 'https://') : '';
        if (this.photoURL)
          this.avatarData = {
            url: memberDetails?.avatar?.url,
            alt: memberDetails?.avatar?.alt
          }
        this.memberDetails = memberDetails
        this.setMemberDetails(memberDetails);
      })

    })
  }


  setUserDetails(userDetails: User) {
    this.profileForm.controls['phone'].setValue(userDetails.mobile);
    this.profileForm.controls['birth'].setValue(userDetails.birthdate ? formatDate(
      userDetails.birthdate,
      "yyyy/MM/dd",
      "en"
    ) : '');
  }

  setMemberDetails(memberDetails: Member) {
    this.profileForm.controls['biography'].setValue(memberDetails.bio);
    this.profileForm.controls['lang'].setValue(memberDetails.lang);
    this.profileForm.controls['displayName'].setValue(memberDetails.fullname);
  }

  setIntrestForm(userDetails) {
    let selectedLanguage = this.languageService.getSelectedLanguage()
    this.categoryService.getAll(userDetails.lang ? userDetails.lang : selectedLanguage).subscribe((categoryList) => {
      this.categoriesArray = categoryList;
      let updatedCategory = this.getUpdatedCategories(categoryList);
      let intrestList = updatedCategory.catList;
      for (let index = 0; index < intrestList.length; index++) {
        const intrest = intrestList[index];
        if (userDetails.interests && userDetails.interests.length > 0) {
          userDetails.interests.forEach(obj => {
            if (obj.id == intrest.id) {
              intrestList[index].status = true;
            }
          });
        }
      }

      this.notificationConfigList = intrestList;
      this.interestForm = this.interestForm = this.fb.group(updatedCategory.formObj);
    })

  }
  getUpdatedCategories(categoryList) {
    let newCatList = [];
    let formObj = {};
    categoryList.forEach(category => {
      let newCat = {
        id: category.id,
        slug: category.slug,
        title: category.title,
        lf_list_id: category.lf_list_id,
        lf_allmem_id: category.lf_allmem_id,
        desc: "",
        icon: "usergroup-add",
        color: "ant-avatar-orange",
        status: false,
      }
      newCatList.push(newCat);
      formObj[category.id] = [null]
    });




    return {
      catList: newCatList,
      formObj: formObj
    };
  }

  showConfirm(password: string): void {
    let $message = this.translate.instant("confirmPassMessage");
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      $message = this.translate.instant("confirmPassMessage");
    })


    this.modalService.confirm({
      nzTitle: "<i>" + $message + "</i>",
      nzOnOk: () => {
        this.userService.updatePassword(password).then(() => {
          this.showSuccess();
        })
      },
    });
  }
  showSuccess(): void {

    let $message = this.translate.instant("profileSaveMessage");
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      $message = this.translate.instant("confirmPassMessage");
    })
    this.modalService.success({
      nzTitle: "<i>" + $message + "</i>",
    });
  }

  submitForm(): void {


    for (const i in this.changePWForm.controls) {
      this.changePWForm.controls[i].markAsDirty();
      this.changePWForm.controls[i].updateValueAndValidity();
    }
    this.showConfirm(this.changePWForm.get("newPassword").value);
  }

  private getBase64(img: File, callback: (img: {}) => void): void {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: UploadFile }): void {
    if (!this.currentUser)
      return;
    this.isPhotoChangeLoading = true;
    this.getBase64(info.file.originFileObj, (img: string) => {
      this.photoURL = img;
      this.userService.addProfileImage(this.currentUser.uid, img, info.file?.name).then((details) => {
        this.avatarData = details;
        this.isPhotoChangeLoading = false;
      }).catch(() => {
        this.isPhotoChangeLoading = false;
        console.log('Image not uploaded properly')
      });
    })
  }

  async saveBasicDetails() {
    if (!this.currentUser)
      return;

    if (!this.avatarData) {
      this.modalService.warning({
        nzTitle: this.translate.instant("ProfileImageErrorTitle"),
        nzContent: this.translate.instant("ProfileImageErrorContent")
      });
      return
    }


    for (const i in this.profileForm.controls) {
      this.profileForm.controls[i].markAsDirty();
      this.profileForm.controls[i].updateValueAndValidity();
    }
    if (this.findInvalidControls().length == 0) {

      let mobile = this.profileForm.get("phone").value;;
      let birthdate = formatDate(
        this.profileForm.get("birth").value,
        "yyyy/MM/dd",
        "en"
      );;
      let bio = this.profileForm.get("biography").value;
      let lang = this.profileForm.get("lang").value;
      let fullname = this.profileForm.get("displayName").value;
      const loggedInUser = this.authService.getLoginDetails();

      if (!loggedInUser)
        return;
      try {
        this.isLoading = true;
        await this.userService.update(this.currentUser.uid, { mobile, birthdate, lang });
        await this.userService.updateMember(this.currentUser.uid, { bio, fullname, lang, slug: this.memberDetails && this.memberDetails.slug ? this.memberDetails.slug : this.getSlug(loggedInUser.displayName), avatar: this.avatarData });
        this.isLoading = false;
        this.showSuccess();
      } catch (e) {
        this.isLoading = false;
      }

    }
  }

  findInvalidControls() {
    const invalid = [];
    const controls = this.profileForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  saveIntrestList() {
    if (!this.currentUser)
      return;
    this.isNotificationLoading = true;
    const interests = [];
    for (const i in this.interestForm.controls) {
      this.interestForm.controls[i].markAsDirty();
      this.interestForm.controls[i].updateValueAndValidity();
      if (this.interestForm.controls[i].value) {
        let categoryObj = this.categoriesArray.find(cat => cat.id == i);
        if (categoryObj) {
          interests.push(categoryObj);
        }
      }
    }

    this.userService
      .update(this.currentUser.uid, { interests })
      .then(() => {
        this.isNotificationLoading = false;
        this.showSuccess();

        this.analyticsService.logEvents('interest_opt_in', interests.map(interest => {
          return {
            category_title: interest.title,
            category_id: interest.id,
            user_uid: this.currentUser.uid,
            user_name: this.currentUser.displayName
          };
        }));
      });
  }

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('newPassword').value !== c.get('confirmPassword').value) {
      return { invalid: true };
    }
  }
  private getSlug(displayName: string) {
    return this.slugify(displayName)
  }

  slugify(string) {
    return string
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z ]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  }

}
