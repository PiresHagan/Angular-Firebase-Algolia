
import { Component } from "@angular/core";
import { UploadFile } from "ng-zorro-antd";
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { NzModalService } from "ng-zorro-antd";
import { NzMessageService } from "ng-zorro-antd";
import { UserService } from "src/app/shared/services/user.service";
import "firebase/storage";
import { User } from "src/app/shared/interfaces/user.type";
import { formatDate } from "@angular/common";
import { TranslateService, LangChangeEvent } from "@ngx-translate/core";
import { Member } from "src/app/shared/interfaces/member.type";
import { CategoryService } from "src/app/shared/services/category.service";
import { LanguageService } from "src/app/shared/services/language.service";
import { AuthService } from "src/app/shared/services/authentication.service";
import { CommonBackofficeService } from "../../shared/services/common-backoffice.service";


@Component({
  templateUrl: './staff-settings.component.html',
  styleUrls: ['./staff-settings.component.scss']
})
export class StaffSettingsComponent {

  changePWForm: FormGroup;
  categoriesArray = [];
  photoURL: string;
  selectedCountry: any;
  profileForm: FormGroup;

  currentUserEmail: string;
  isLoading: boolean = false;
  isChangePassLoading: boolean = false;

  currentUser: User;
  isPhotoChangeLoading: boolean = false;
  memberDetails: Member;
  userDetails: User;
  loggedInUser: Member;
  memberEmail: string;
  memberName: string;
  memberSlug: string;
  memberList;
  loadingMore;
  lastVisible;
  notFound = false;

  constructor(
    private fb: FormBuilder,
    private modalService: NzModalService,
    private message: NzMessageService,
    private userService: UserService,
    public translate: TranslateService,
    public categoryService: CategoryService,
    public languageService: LanguageService,
    public commonBackofficeService: CommonBackofficeService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scrollEvent, true);
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
      phone: [null],
      birth: [null],
      biography: [null],
      displayName: [null, [Validators.required]],
    });
    this.getMemberList();
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;
      this.loggedInUser = await this.authService.getLoggedInUserDetails();

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
    this.profileForm.controls['displayName'].setValue(memberDetails.fullname);
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
        lf_allsubs_id: category.lf_allsubs_id,
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
        this.commonBackofficeService.updatePassword(this.currentUser.email, password).then(() => {
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
      this.userService.addProfileImage(this.currentUser.id, img, info.file?.name).then(() => {
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
    for (const i in this.profileForm.controls) {
      this.profileForm.controls[i].markAsDirty();
      this.profileForm.controls[i].updateValueAndValidity();
    }
    if (this.findInvalidControls().length == 0) {

      let mobile = this.profileForm.get("phone").value ? this.profileForm.get("phone").value : '';;
      let birthdate = this.profileForm.get("birth").value ? formatDate(
        this.profileForm.get("birth").value,
        "yyyy/MM/dd",
        "en"
      ) : '';;
      let bio = this.profileForm.get("biography").value ? this.profileForm.get("biography").value : '';
      let fullname = this.profileForm.get("displayName").value;

      try {
        this.isLoading = true;
        await this.userService.update(this.currentUser.id, { mobile, birthdate });
        await this.userService.updateMember(this.currentUser.id, { bio, fullname });
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


  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('newPassword').value !== c.get('confirmPassword').value) {
      return { invalid: true };
    }
  }
  getMemberDetails() {

    let searchKey;
    let searchValue;
    if (this.memberEmail) {
      this.memberSlug = "";
      this.memberName = "";
      searchKey = "email";
      searchValue = this.memberEmail
    }
    if (this.memberName) {
      this.memberSlug = "";
      this.memberEmail = "";
      searchKey = "fullname";
      searchValue = this.memberName
    }
    if (this.memberSlug) {
      this.memberName = "";
      this.memberEmail = "";
      searchKey = "slug";
      searchValue = this.memberSlug
    }

    this.commonBackofficeService.getMember(searchKey, searchValue).subscribe((receiVedUserDetails) => {

      const userDetails = receiVedUserDetails ? receiVedUserDetails[0] : null;
      if (!userDetails) {
        this.notFound = true;
        setTimeout(() => {
          this.notFound = false;
        }, 1000);
      } else {
        this.setMember(userDetails);
      }

    })

  }
  getMemberDetailsById(id) {
    this.userService.getMember(id).subscribe((receiVedUserDetails) => {
      this.setMember(receiVedUserDetails);
    })
  }
  setMember(userDetails) {

    this.currentUser = userDetails;
    this.currentUserEmail = userDetails.email;
    this.setUserDetails(userDetails);
    this.userDetails = userDetails;
    this.userService.getMember(this.userDetails.id).subscribe((memberDetails) => {
      this.photoURL = memberDetails?.avatar?.url;
      this.memberDetails = memberDetails
      this.setMemberDetails(memberDetails);
    })
  }
  getMemberList() {
    this.commonBackofficeService.getMemberList().subscribe((memberData) => {
      this.memberList = memberData.memberList;
      this.lastVisible = memberData.lastVisible;
    })
  }
  editMember(id) {
    this.getMemberDetailsById(id);
  }

  deleteMember(id: string) {
    let memberMessageConf = this.translate.instant("DeletMsgConf");
    let memberMessageSucc = this.translate.instant("DeletMsgSuc");
    let memberErrorMsg = this.translate.instant("somethingWrongErr");
    this.modalService.confirm({
      nzContent: memberMessageConf,
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.commonBackofficeService.deleteMember(id).subscribe(() => {
            this.modalService.success({
              nzTitle: "<i>" + memberMessageSucc + "</i>",
            });
            resolve();
          }, (err) => {
            this.modalService.error({
              nzTitle: "<i>" + memberErrorMsg + "</i>",
            });
            reject();
          })
        }).catch(() => console.log('Oops errors!'))
    });
  }
  goBack() {
    this.memberEmail = "";
    this.currentUser = null;
  }
  scrollEvent = (event: any): void => {
    let documentElement = event.target.documentElement ? event.target.documentElement : event.target;
    if (documentElement) {
      const top = documentElement.scrollTop
      const height = documentElement.scrollHeight
      const offset = documentElement.offsetHeight
      console.log(height, offset, top)
      if (top > height - offset - 1 - 100 && this.lastVisible && !this.loadingMore) {
        this.loadingMore = true;
        this.commonBackofficeService.getMemberList(null, 'next', this.lastVisible).subscribe((memberListData) => {
          this.loadingMore = false;
          if (memberListData &&
            memberListData.memberList &&
            memberListData.memberList[0]
            && memberListData.memberList.length > 1
            && memberListData.memberList[0].id !== this.loggedInUser.id)
            this.memberList = [...this.memberList, ...memberListData.memberList];
          this.lastVisible = memberListData.lastVisible;
        });
      }
    }

  }
}
