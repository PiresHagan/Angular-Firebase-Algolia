import { Injectable } from '@angular/core';
import { Language } from '../interfaces/language.type';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  languageList: Language[] = [{
    "code": "en",
    "labal": "English",
  },
  {
    "code": "nl",
    "labal": "Dutch",
  }]
  defaultLanguage: string = 'en';

  public isSelectedLang = new BehaviorSubject<string>(this.defaultLanguage);
  selectedLang: Observable<string> = this.isSelectedLang.asObservable();

  constructor() { }

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
    this.isSelectedLang.next(lng);
  }
}
