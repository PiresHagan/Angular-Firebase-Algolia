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
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/shared/services/language.service";

@Component({
  templateUrl: "./profile-settings.component.html",
})
export class ProfileSettingsComponent {
  changePWForm: FormGroup;
  photoURL: string;
  selectedCountry: any;
  selectedLanguage: any;
  profileForm: FormGroup;
  interestForm: FormGroup;
  currentUserEmail: string;
  isLoading: boolean = false;
  isChangePassLoading: boolean = false;
  isNotificationLoading: boolean = false;
  currentUser: User;
  isPhotoChangeLoading: boolean = false;

  notificationConfigList = [
    {
      id: "life",
      title: "Life and styles",
      desc: "Allow people found on your public.",
      icon: "user",
      color: "ant-avatar-blue",
      status: false,
    },
    {
      id: "business",
      title: "Business",
      desc: "Allow any peole to contact.",
      icon: "mobile",
      color: "ant-avatar-cyan",
      status: false,
    },
    {
      id: "news",
      title: "News",
      desc: "Turning on Location lets you explore what's around you.",
      icon: "environment",
      color: "ant-avatar-gold",
      status: false,
    },
    {
      id: "sport",
      title: "Sport",
      desc: "Receive daily email notifications.",
      icon: "mail",
      color: "ant-avatar-purple",
      status: false,
    },
    {
      id: "religion",
      title: "Religion",
      desc: "Allow all downloads from unknow source.",
      icon: "question",
      color: "ant-avatar-red",
      status: false,
    },
    {
      id: "creative",
      title: "Creative",
      desc: "Allow data synchronize with cloud server",
      icon: "swap",
      color: "ant-avatar-green",
      status: false,
    },
    {
      id: "opinion",
      title: "Opinion",
      desc: "Allow any groups invitation",
      icon: "usergroup-add",
      color: "ant-avatar-orange",
      status: false,
    },
    {
      id: "tech",
      title: "Tech and science",
      desc: "Allow any groups invitation",
      icon: "usergroup-add",
      color: "ant-avatar-orange",
      status: false,
    },
    {
      id: "ent",
      title: "Entertainement",
      desc: "Allow any groups invitation",
      icon: "usergroup-add",
      color: "ant-avatar-orange",
      status: false,
    },
  ];

  constructor(
    private fb: FormBuilder,
    private modalService: NzModalService,
    private message: NzMessageService,
    private userService: UserService,
    public translate: TranslateService,
  ) { }

  ngOnInit(): void {

    this.currentUser = this.userService.getUserFromLocalStorage();
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
      birth: [null, [Validators.required]],
      biography: [null],
      displayName: [null, [Validators.required]],
    });

    /**
     * Intrest List Form
     */
    this.interestForm = this.fb.group({
      life: [null],
      business: [null],
      news: [null],
      sport: [null],
      religion: [null],
      creative: [null],
      opinion: [null],
      tech: [null],
      ent: [null],
      later: [null],
    });

    this.setDataFormDatas();
  }

  setDataFormDatas() {

    this.userService.getSavedUser().subscribe((data) => {
      if (data) {
        this.profileForm.setValue({
          phone: data.phone,
          biography: data.biography,
          displayName: data.displayName,
          birth: new Date(Date.parse(data.birth)),
        });
        this.setIntrestValueInForm(data.interests);
        this.currentUserEmail = data.email;
        this.photoURL = data.photoURL;
      }



    });
    this.userService
      .getCurrentUserDetails()
      .subscribe(
        ({
          phone,
          birth,
          biography,
          photoURL,
          email,
          displayName,
          interests,
        }) => {
          this.profileForm.setValue({
            phone,
            biography,
            displayName,
            birth: new Date(Date.parse(birth)),
          });
          this.setIntrestValueInForm(interests);
          this.currentUserEmail = email;
          this.photoURL = photoURL;
        }
      );
  }

  showConfirm(password: string): void {
    this.modalService.confirm({
      nzTitle: "<i>Do you want to change your password?</i>",
      nzOnOk: () => {
        this.userService.updatePassword(password).then(() => {
          this.showSuccess();
        })
      },
    });
  }
  showSuccess(): void {
    this.modalService.success({
      nzTitle: "<i>Your changes have been saved.</i>"
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
    this.isPhotoChangeLoading = true;
    this.getBase64(info.file.originFileObj, (img: string) => {
      this.photoURL = img;
      this.userService.addProfileImage(this.userService.getUserFromLocalStorage(), img).then(() => {
        this.isPhotoChangeLoading = false;
      }).catch(() => {
        this.isPhotoChangeLoading = false;
        console.log('Image not uploaded properly')
      });
    })
  }

  saveBasicDetails() {
    for (const i in this.profileForm.controls) {
      this.profileForm.controls[i].markAsDirty();
      this.profileForm.controls[i].updateValueAndValidity();
    }
    if (this.findInvalidControls().length == 0) {
      const phone = this.profileForm.get("phone").value;
      const birth = formatDate(
        this.profileForm.get("birth").value,
        "yyyy/MM/dd",
        "en"
      );
      const biography = this.profileForm.get("biography").value;

      let newuser = {} as User;
      newuser.phone = phone;
      newuser.birth = birth;
      newuser.biography = biography;
      newuser.displayName = this.profileForm.get("displayName").value;

      let fields: any = { ...newuser };
      this.isLoading = true;
      this.userService
        .update(this.currentUser.uid, fields)
        .then(() => {
          this.isLoading = false;
          this.showSuccess();
        });
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
    this.isNotificationLoading = true;
    const interests = [];
    for (const i in this.interestForm.controls) {
      this.interestForm.controls[i].markAsDirty();
      this.interestForm.controls[i].updateValueAndValidity();
      if (this.interestForm.controls[i].value) interests.push(i);
    }
    let fields: any = {
      interests: interests,
    };
    this.userService
      .update(this.currentUser.uid, fields)
      .then(() => {
        this.isNotificationLoading = false;
        this.showSuccess();
      });
  }

  setIntrestValueInForm(interests) {
    let intrestList = this.notificationConfigList;
    for (let index = 0; index < intrestList.length; index++) {
      const intrest = intrestList[index];
      if (interests && interests.includes(intrest.id)) {
        intrestList[index].status = true;
      }
    }

    this.notificationConfigList = intrestList;
  }
  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('newPassword').value !== c.get('confirmPassword').value) {
      return { invalid: true };
    }
  }
}
