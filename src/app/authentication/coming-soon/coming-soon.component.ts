import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/shared/services/language.service';
import { Language } from "src/app/shared/interfaces/language.type";

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss']
})
export class ComingSoonComponent implements OnInit {

  languageList: Language[];
  selectedLanguage: string;

  constructor(
    private language: LanguageService
  ) { }

  ngOnInit(): void {
    this.languageList = this.language.geLanguageList();
    this.selectedLanguage = this.language.defaultLanguage;
  }

  switchLang(lang: string) {
    this.language.changeLangOnBoarding(lang);
  }

}
