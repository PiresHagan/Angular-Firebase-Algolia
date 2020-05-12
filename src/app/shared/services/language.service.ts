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
    "code": "sp",
    "labal": "Spanish",
  },
  {
    "code": "nl",
    "labal": "Dutch",
  }
  ]
  defaultLanguage: string = 'en';

  public isSelectedLang = new BehaviorSubject<string>(this.defaultLanguage);
  selectedLang: Observable<string> = this.isSelectedLang.asObservable();

  constructor(public translate: TranslateService) {

    this.translate.addLangs(this.getLanguageListArr());
    this.translate.setDefaultLang(this.defaultLanguage);

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
    this.translate.use(lng);
    this.isSelectedLang.next(lng);
  }
  getSelectedLanguage() {
    return this.selectedLanguage ? this.selectedLanguage : this.defaultLanguage;
  }
}
