import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { NzModalService, UploadFile } from "ng-zorro-antd";
import { LanguageService } from "src/app/shared/services/language.service";
import { UserService } from "../../shared/services/user.service";
import { AuthService } from "src/app/shared/services/authentication.service";
import { Language } from "src/app/shared/interfaces/language.type";
import { User } from "src/app/shared/interfaces/user.type";
import { ADVISOR, COMPANY, ECOMMERCE, FUNDRAISER, GUESTPOST, HOSTEVENT, INFLUENCERMARKETPLACE, INVESTMENT, JOB, ONLINECOURSE, PAIDPREMIUMGROUP, POLITICIAN, MEMBER, RESTAURANT, SERVICES, VACATIONSRENTALS } from 'src/app/shared/constants/member-constant';

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  avatarUrl: string = "";
  memberDetails;
  userDetails: User;
  isPhotoChangeLoading: boolean = false;
  isFormSaving: boolean = false;
  currentUser: any;
  avatarData = null;
  languageList: Language[];
  selectedLanguage: string;
  userTypeList = [];
  selectedIndex: number; //This parameter defines the selected user type
  loggedInUser;
  isLoaded: boolean;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: NzModalService,
    private userService: UserService,
    public translate: TranslateService,
    private authService: AuthService,
    private _location: Location,
    private language: LanguageService
  ) {}

  switchLang(lang: string) {
    this.language.changeLangOnBoarding(lang);
  }

  ngOnInit(): void {
    this.languageList = this.language.geLanguageList();
    this.selectedLanguage = this.language.defaultLanguage;
    this.profileForm = this.fb.group({
      user_type: ["", [Validators.required]],
    });
    this.setFormData();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.profileForm.controls;
  }

  backClicked() {
    this._location.back();
  }

  setFormData() {
    this.userService.getCurrentUser().then((user) => {
      this.userService.get(user.uid).subscribe((userDetails) => {
        this.currentUser = userDetails;
      });

      this.userService.getUserTypeData().then((data) => {
        this.userTypeList = data.user_types;
        let storedType = localStorage.getItem("user_type");
        storedType
          ? this.f["user_type"].setValue(localStorage.getItem("user_type"))
          : this.f["user_type"].setValue("");
        this.selectedIndex = this.userTypeList.findIndex(
          (type) => type == storedType
        );
        this.isLoaded = true;
      });

      this.userService.getMember(user.uid).subscribe((memberDetails) => {
        this.avatarUrl = memberDetails?.avatar?.url;
        if (memberDetails?.avatar && memberDetails?.avatar?.url)
          this.avatarData = {
            url: memberDetails?.avatar?.url,
            alt: memberDetails?.avatar?.alt,
          };

        if (memberDetails?.user_type)
          this.profileForm.controls["user_type"].setValue(
            memberDetails?.user_type
          );

        if (memberDetails?.bio)
          this.profileForm.controls["bio"].setValue(memberDetails?.bio);

        this.memberDetails = memberDetails;
      });

      this.userService.get(user.uid).subscribe((userDetails: User) => {
        this.userDetails = userDetails;
      });
    });
  }

  async submitForm() {
    const user_type = this.profileForm.get("user_type").value;

    if (!this.currentUser) return;

    for (const i in this.profileForm.controls) {
      this.profileForm.controls[i].markAsDirty();
      this.profileForm.controls[i].updateValueAndValidity();
    }

    if (!this.avatarData) {
      this.modalService.warning({
        nzTitle: this.translate.instant("ProfileImageErrorTitle"),
        nzContent: this.translate.instant("ProfileImageErrorContent"),
      });
      return;
    }
    if (this.findInvalidControls().length == 0) {
      try {
        this.isFormSaving = true;
        const loggedInUser = this.authService.getLoginDetails();
        if (!loggedInUser) return;
        await this.userService.updateBasicDetails(this.currentUser.id, {
          user_type: user_type ? user_type : "",
          type: user_type ? user_type : "",
          avatar: this.avatarData,
        });
        this.isFormSaving = false;
        localStorage.setItem("user_type", user_type);
        if (
          user_type == FUNDRAISER ||
          user_type == ECOMMERCE  ||
          user_type == GUESTPOST ||
          user_type == MEMBER ||
          user_type == ADVISOR ||
          user_type == ONLINECOURSE ||
          user_type == JOB ||
          user_type == PAIDPREMIUMGROUP ||
          user_type == INFLUENCERMARKETPLACE ||
          user_type == RESTAURANT ||
          user_type == HOSTEVENT ||
          user_type == POLITICIAN ||
          user_type == INVESTMENT ||
          user_type == VACATIONSRENTALS ||
          user_type == SERVICES ||
          user_type == PAIDPREMIUMGROUP
        ) {
          this.router.navigate(["/auth/import-contact"]);
        } else if (user_type == COMPANY) {
          this.router.navigate(["auth/company"]);
        } else {
          this.router.navigate(["/auth/website"]);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  private getBase64(img: File, callback: (img: {}) => void): void {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: UploadFile }): void {
    if (!this.currentUser) return;
    this.isPhotoChangeLoading = true;
    this.getBase64(info.file.originFileObj, (img: string) => {
      this.avatarUrl = img;
      this.userService
        .addProfileImage(this.currentUser.id, img, info.file?.name)
        .then((uploadedImage: any) => {
          this.isPhotoChangeLoading = false;
          this.avatarData = {
            url: uploadedImage.url,
            alt: uploadedImage.alt,
          };
        })
        .catch(() => {
          this.isPhotoChangeLoading = false;
        });
    });
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

  select(index: number, type: string): void {
    this.selectedIndex = index;
    this.f["user_type"].setValue(type);
  }
}
