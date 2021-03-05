import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { LanguageService } from 'src/app/shared/services/language.service';
import { UserService } from '../../shared/services/user.service';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { Category } from 'src/app/shared/interfaces/category.type';
import { CategoryService } from 'src/app/shared/services/category.service';
import { Language } from 'src/app/shared/interfaces/language.type';

@Component({
  selector: 'app-add-website',
  templateUrl: './add-website.component.html',
  styleUrls: ['./add-website.component.scss']
})
export class AddWebsiteComponent implements OnInit {

  websiteForm: FormGroup;
  currentUser: any;
  memberDetails;
  isFormSaving: boolean = false;
  dailyTrafficOptions = [
    {
      label: "< 1k page view",
      value: "< 1k page view"
    },
    {
      label: "1k - 10k page views",
      value: "1k - 10k page views"
    },
    {
      label: "10k - 100k page views",
      value: "10k - 100k page views"
    },
    {
      label: "100k - 1M page views",
      value: "100k - 1M page views"
    },
    {
      label: "> 1M page views",
      value: "> 1M page views"
    }
  ];
  categoryList: Category[] = [];
  languageList: Language[];
  selectedLanguage: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    public translate: TranslateService,
    private languageService: LanguageService,
    private _location: Location,
    private userService: UserService,
    private categoryService: CategoryService,
  ) { }

  switchLang(lang: string) {
    this.languageService.changeLangOnBoarding(lang);
  }

  ngOnInit(): void {
    this.languageList = this.languageService.geLanguageList();
    this.selectedLanguage = this.languageService.defaultLanguage;

    this.websiteForm = this.fb.group({
      url: [null, [Validators.required]],
      monthly_traffic: [null, [Validators.required]],
      category: [null, [Validators.required]],
      lang: [null, [Validators.required]],
    });

    this.setFormData();
  }

  setFormData() {
    this.userService.getCurrentUser().then((user) => {
      this.userService.get(user.uid).subscribe((userDetails) => {
        this.currentUser = userDetails;
      });
      
      this.userService.getMember(user.uid).subscribe((memberDetails) => {
        if(memberDetails?.onboarding_website?.url) 
          this.websiteForm.controls['website_url'].setValue(memberDetails.onboarding_website.website_url);

        if(memberDetails?.onboarding_website?.monthly_traffic) 
          this.websiteForm.controls['monthly_traffic'].setValue(memberDetails.onboarding_website.monthly_traffic);

        if(memberDetails?.onboarding_website?.category) 
          this.websiteForm.controls['category'].setValue(memberDetails.onboarding_website.category);
        
        if(memberDetails?.onboarding_website?.lang) 
          this.websiteForm.controls['lang'].setValue(memberDetails.onboarding_website.lang);

        this.memberDetails = memberDetails;
      })
    })
  }

  async submitForm() {

    if (!this.currentUser)
      return;

    for (const i in this.websiteForm.controls) {
      this.websiteForm.controls[i].markAsDirty();
      this.websiteForm.controls[i].updateValueAndValidity();
    }

    if (this.websiteForm.valid) {
      try {
        this.isFormSaving = true;
        const loggedInUser = this.authService.getLoginDetails();
        if (!loggedInUser)
          return;
        await this.userService.updateSpecificDetails(
          this.currentUser.id,
          this.websiteForm.value
        );
        this.isFormSaving = false;
        this.goToNext();
      } catch (error) {
        this.isFormSaving = false;
        console.log(error);
      }

    }
  }

  languageSelected(language: string) {
    if (!language)
      return
    this.websiteForm.controls['category'].setValue(null);
    this.categoryService.getAll(language).subscribe((categoryList) => {
      this.categoryList = categoryList ? categoryList : [];
    })
  }

  backClicked() {
    this._location.back();
  }

  goToNext() {
    this.router.navigate(['/auth/onboarding/import-contact']);
  }
}
