import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/shared/services/language.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  selectedLanguage: string;
  constructor(
    public translate: TranslateService,
    private language: LanguageService,) { }

  ngOnInit(): void {
    this.selectedLanguage = this.language.getSelectedLanguage();
  }

}
