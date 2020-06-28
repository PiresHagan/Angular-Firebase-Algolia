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

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: NzModalService,
    private message: NzMessageService,
    private userService: UserService,
    public translate: TranslateService,
    private languageService: LanguageService
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
        await this.userService.update(this.currentUser.id, { mobile, birthdate, lang })
        await this.userService.updateMember(this.currentUser.id, { bio: bio ? bio : '', lang });

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

}
