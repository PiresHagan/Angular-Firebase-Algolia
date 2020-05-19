import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService, NzMessageService, UploadFile } from 'ng-zorro-antd';
import { UserService } from '../../shared/services/user.service';
import { formatDate } from '@angular/common';

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: NzModalService,
    private message: NzMessageService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.profileForm = this.fb.group({
      phone: [null, [Validators.required]],
      birth: [null, [Validators.required]],
      biography: [null],
      later: [null]
    });
    this.setFormData();
  }
  setFormData() {
    this.userService.getCurrentUser().then((user) => {
      this.currentUser = user;
      this.userService.get(user.uid).subscribe((userDetails) => {
        this.avatarUrl = userDetails.photoURL
        const birth = userDetails.birth ? formatDate(
          userDetails.birth,
          "yyyy/MM/dd",
          "en"
        ) : '';
        this.profileForm.controls['birth'].setValue(birth ? birth : '');
        this.profileForm.controls['biography'].setValue(userDetails.biography);
        this.profileForm.controls['phone'].setValue(userDetails.phone);
      })

    })
  }

  submitForm(): void {
    if (!this.currentUser)
      return;



    for (const i in this.profileForm.controls) {
      this.profileForm.controls[i].markAsDirty();
      this.profileForm.controls[i].updateValueAndValidity();
    }

    if (this.findInvalidControls().length == 0 || this.profileForm.get('later').value) {
      this.isFormSaving = true;
      const phone = this.profileForm.get('phone').value;
      const birth = formatDate(this.profileForm.get('birth').value, 'yyyy/MM/dd', "en");
      const biography = this.profileForm.get('biography').value;

      this.userService.update(this.currentUser.uid, { phone, birth, biography }).then(() => {
        this.isFormSaving = false;
        this.router.navigate(['/auth/interest']);
      }).catch(() => {
        this.isFormSaving = true;
      })
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
      this.userService.addProfileImage(this.currentUser.uid, img).then(() => {
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
