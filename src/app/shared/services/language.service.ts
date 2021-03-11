import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Language } from '../interfaces/language.type';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  selectedLanguage: string;

  languageList: Language[] = [{
    "code": "en",
    "label": "English",
  },
  {
    "code": "fr",
    "label": "Français",
  }, {
    "code": "es",
    "label": "Español",
  }
  ]
  defaultLanguage: string = 'en';

  public isSelectedLang;
  selectedLang: Observable<string>

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public translate: TranslateService,
    private router: Router) {

    this.translate.addLangs(this.getLanguageListArr());
    this.selectedLanguage = this.getlanguageFromLS() ? this.getlanguageFromLS() : this.defaultLanguage;
    this.defaultLanguage = this.getlanguageFromLS() ? this.getlanguageFromLS() : this.defaultLanguage;
    this.translate.setDefaultLang(this.getlanguageFromLS() ? this.getlanguageFromLS() : this.defaultLanguage);
    this.isSelectedLang = new BehaviorSubject<string>(this.defaultLanguage);
    this.selectedLang = this.isSelectedLang.asObservable();
  }

  geLanguageList() {
    return this.languageList;
  }
  getLanguageListArr() {
    const languageListArr = [];
    for (const key in this.languageList) {
      const language = this.languageList[key].code;
      languageListArr.push(language);
    }
    return languageListArr;
  }
  changeLang(lng: string) {
    this.selectedLanguage = lng;
    this.setlanguageInLS(lng);
    this.translate.use(lng);
    this.isSelectedLang.next(lng);
    this.router.navigate(['/']);
  }

  changeLangOnBoarding(lng: string) {
    this.selectedLanguage = lng;
    this.setlanguageInLS(lng);
    this.translate.use(lng);
    this.isSelectedLang.next(lng);
  }

  getSelectedLanguage() {
    return this.selectedLanguage ? this.selectedLanguage : this.defaultLanguage;
  }
  setlanguageInLS(lang) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user_lang', lang);
    }
  }
  getlanguageFromLS() {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem('user_lang') : this.defaultLanguage;
  }
  getLanguageByCode(code: string) {
    for (let index = 0; index < this.languageList.length; index++) {
      const language = this.languageList[index];
      if (language.code == code) {
        return language;
      }

    }
  }
}
