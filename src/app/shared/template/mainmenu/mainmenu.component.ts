import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../interfaces/category.type';
import { Observable } from 'rxjs';
import { LanguageService } from '../../services/language.service';
import { TranslateService, LangChangeEvent } from "@ngx-translate/core";

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.scss']
})
export class MainmenuComponent implements OnInit {

  categories: Observable<Category[]>;
  searchVisible: boolean = false;
  selectedLanguage: string;

  constructor(private categoryService: CategoryService, private languageService: LanguageService, private translate: TranslateService) { }

  ngOnInit(): void {

    this.selectedLanguage = this.languageService.getSelectedLanguage();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.categories = this.categoryService.getAll(this.languageService.getSelectedLanguage());
    })

    this.categories = this.categoryService.getAll(this.selectedLanguage);
  }

  searchToggle(): void {
    this.searchVisible = !this.searchVisible;
  }

}
