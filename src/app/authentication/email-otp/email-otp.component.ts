import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/shared/services/language.service';
import {Location} from '@angular/common';
import { Language } from 'src/app/shared/interfaces/language.type';
@Component({
  selector: 'app-email-otp',
  templateUrl: './email-otp.component.html',
  styleUrls: ['./email-otp.component.scss']
})
export class EmailOtpComponent implements OnInit {

  languageList: Language[];
  selectedLanguage: string;

  constructor(
    public translate: TranslateService,
    private _location: Location,
    private language: LanguageService
  ) { }

  ngOnInit(): void {
    this.languageList = this.language.geLanguageList();
    this.selectedLanguage = this.language.defaultLanguage;
  }

  backClicked() {
    this._location.back();
  }

  switchLang(lang: string) {
    this.language.changeLangOnBoarding(lang);
  }
}
