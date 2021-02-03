import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { UserService } from '../../shared/services/user.service';
import * as firebase from 'firebase/app';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { LanguageService } from 'src/app/shared/services/language.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-interest',
  templateUrl: './interest.component.html',
  styleUrls: ['./interest.component.css']
})
export class InterestComponent implements OnInit {
  interestForm: FormGroup;
  currentUser: any;
  isFormSaving: boolean = false;
  categoriesArray = [];

  notificationConfigList = []

  constructor(
    private fb: FormBuilder,
    public categoryService: CategoryService,
    private router: Router,
    private modalService: NzModalService,
    private userService: UserService,
    public translate: TranslateService,
    private language: LanguageService,
    private analyticsService: AnalyticsService,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.userService.getCurrentUser().then((user) => {
      this.currentUser = user;
      this.userService.get(user.uid).subscribe((userDetails) => {
        this.setIntrestForm(userDetails)
      })
    })
  }

  setIntrestForm(userDetails) {
    let selectedLanguage = this.language.getSelectedLanguage()
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
    formObj['later'] = [null]

    return {
      catList: newCatList,
      formObj: formObj
    };
  }

  submitForm(): void {
    this.isFormSaving = true;
    let interests = [];

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

    this.userService.update(this.currentUser.uid, { interests }).then(() => {
      this.isFormSaving = false;
      this.router.navigate(['/auth/import-contact']);
      // this.done();            

      this.analyticsService.logEvents('interest_opt_in', interests.map(interest => {
        return {
          category_title: interest.title,
          category_id: interest.id,
          user_uid: this.currentUser.uid,
          user_name: this.currentUser.displayName,
        };
      }));
    });
  }

  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.interestForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.interestForm.controls.password.value) {
      return { confirm: true, error: true };
    }
  }
  done() {
    this.modalService.success({
      nzTitle: 'Congratulations',
      nzContent: 'Well done! You are all set.',
      nzOnOk: () => { 
        if(this.userService.userData?.isNewConsoleUser) {
          this.authService.redirectToConsole(`${environment.consoleURL}/settings/profile-settings`, {});
        } else {
          this.router.navigate(['/app/settings/profile-settings']);
        }
      }
    });
  }



}
