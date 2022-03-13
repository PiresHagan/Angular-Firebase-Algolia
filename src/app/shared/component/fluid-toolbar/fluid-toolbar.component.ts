import { Component, OnInit } from "@angular/core";
import { Language } from "../../interfaces/language.type";
import { LanguageService } from "../../services/language.service";

@Component({
  selector: "app-fluid-toolbar",
  templateUrl: "./fluid-toolbar.component.html",
  styleUrls: ["./fluid-toolbar.component.scss"],
})
export class FluidToolbarComponent implements OnInit {
  languageList: Language[];
  selectedLanguage: string;
  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.languageList = this.languageService.geLanguageList();
    this.selectedLanguage = this.languageService.defaultLanguage;
  }
  switchLang(lang: string) {
    this.languageService.changeLangOnBoarding(lang);
  }
}
