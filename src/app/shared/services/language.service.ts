import { Injectable } from '@angular/core';
import { Language } from '../interfaces/language.type';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

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
  getSelectedLanguage() {
    return this.selectedLanguage ? this.selectedLanguage : this.defaultLanguage;
  }
  setlanguageInLS(lang) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('user_lang', lang);
    }
      
  }
  getlanguageFromLS() {
    if(typeof localStorage !== 'undefined'){
      return localStorage.getItem('user_lang');
    }
    
    return 'en';
  }
}
