import { Injectable } from '@angular/core';
import { Language } from '../interfaces/language.type';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  selectedLanguage: string;

  languageList: Language[] = [{
    "code": "en",
    "labal": "English",
  },
  {
    "code": "fr",
    "labal": "French",
  }, {
    "code": "es",
    "labal": "Spanish",
  }
  ]
  defaultLanguage: string = 'en';

  public isSelectedLang;
  selectedLang: Observable<string>

  constructor(public translate: TranslateService) {

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
  }
  getSelectedLanguage() {
    return this.selectedLanguage ? this.selectedLanguage : this.defaultLanguage;
  }
  setlanguageInLS(lang) {
    localStorage.setItem('user_lang', lang);
  }
  getlanguageFromLS() {
    return localStorage.getItem('user_lang');
  }
}
