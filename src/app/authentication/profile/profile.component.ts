import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService, NzMessageService, UploadFile } from 'ng-zorro-antd';
import { UserService } from '../../shared/services/user.service';
import { formatDate } from '@angular/common';
import { User } from 'src/app/shared/interfaces/user.type';
import { Member } from 'src/app/shared/interfaces/member.type';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { LanguageService } from 'src/app/shared/services/language.service';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { environment } from 'src/environments/environment';

declare var FB: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {

  profileForm: FormGroup;
  changePWForm: FormGroup;
  avatarUrl: string = "";
  selectedCountry: any;
  selectedLanguage: any;
  currentUser: any;
  isPhotoChangeLoading: boolean = false;
  isFormSaving: boolean = false;
  languageList;
  loggedInUser;
  fbloading: boolean = false;
  fbAccountLinkStatus: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: NzModalService,
    private message: NzMessageService,
    private userService: UserService,
    public translate: TranslateService,
    private languageService: LanguageService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.languageList = this.languageService.geLanguageList();
    this.profileForm = this.fb.group({
      phone: [null, [Validators.required]],
      birth: [null, [Validators.required]],
      lang: [null, [Validators.required]],
      biography: [null],
      later: [null]
    });
    this.setFormData();

    (window as any).fbAsyncInit = function() {
      FB.init({
        appId      : environment.facebook.appId,
        cookie     : true,
        xfbml      : true,
        version    : environment.facebook.version
      });
        
      FB.AppEvents.logPageView(); 
    };

    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  linkFacebook() {
    this.fbloading = true;
    FB.login((response) => {
      console.log('submitLogin',response);
      if (response.authResponse) {
        this.fbloading = false;
        this.fbAccountLinkStatus = true;
      } else {
      console.log('User login failed');
      this.fbloading = false;
      }
    });
  }

  unlinkFacebook() {
    let self = this;
    this.fbloading = true;
    FB.logout(function(response) {
      self.fbAccountLinkStatus = false;
      self.fbloading = false;
    });
  }

  setUserDetails(userDetails: User) {
    this.profileForm.controls['phone'].setValue(userDetails?.mobile);
    this.profileForm.controls['birth'].setValue(userDetails?.birthdate ? formatDate(
      userDetails.birthdate,
      "yyyy/MM/dd",
      "en"
    ) : '');
  }

  setMemberDetails(memberDetails: Member) {
    this.profileForm.controls['biography'].setValue(memberDetails?.bio);
    this.profileForm.controls['lang'].setValue(memberDetails?.lang);

  }
  setFormData() {
    this.userService.getCurrentUser().then((user) => {


      this.userService.get(user.uid).subscribe((userDetails) => {
        this.currentUser = userDetails;
        this.setUserDetails(userDetails);

      })
      this.userService.getMember(user.uid).subscribe((memberDetails) => {
        this.avatarUrl = memberDetails?.avatar?.url;
        this.setMemberDetails(memberDetails);
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

    if (this.findInvalidControls().length == 0 || this.profileForm.get('later').value) {
      try {
        this.isFormSaving = true;
        const mobile = this.profileForm.get('phone').value;
        const birthdate = formatDate(this.profileForm.get('birth').value, 'yyyy/MM/dd', "en");
        const bio = this.profileForm.get('biography').value;
        const lang = this.profileForm.get('lang').value;
        const loggedInUser = this.authService.getLoginDetails();
        if (!loggedInUser)
          return;
        await this.userService.update(this.currentUser.id, { mobile, birthdate, lang })
        await this.userService.updateMember(this.currentUser.id,
          {
            bio: bio ? bio : '',
            fullname: loggedInUser.displayName,
            lang,
            slug: this.getSlug(loggedInUser.displayName)
          });
        this.isFormSaving = false;
        this.router.navigate(['/auth/interest']);
      } catch (error) {
        console.log(error);
      }

    }
  }

  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.profileForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.profileForm.controls.password.value) {
      return { confirm: true, error: true };
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
      this.userService.addProfileImage(this.currentUser.id, img, info.file?.name).then(() => {
        this.isPhotoChangeLoading = false;
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
  getSlug(displayName: string) {
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
