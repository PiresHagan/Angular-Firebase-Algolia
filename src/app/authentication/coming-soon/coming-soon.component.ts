import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/shared/services/language.service';
import { Language } from "src/app/shared/interfaces/language.type";
import { Location } from "@angular/common";

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss']
})
export class ComingSoonComponent implements OnInit {

  languageList: Language[];
  selectedLanguage: string;

  constructor(
    private language: LanguageService,
    private _location: Location,
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
