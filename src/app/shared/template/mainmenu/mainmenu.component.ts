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
  categoryListData = {};
  categories: Category[];
  searchVisible: boolean = false;
  selectedLanguage: string;

  constructor(private categoryService: CategoryService, private languageService: LanguageService, private translate: TranslateService) { }

  ngOnInit(): void {

    this.selectedLanguage = this.languageService.getSelectedLanguage();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.selectedLanguage = this.languageService.getSelectedLanguage();
      this.categoryService.getAll(this.selectedLanguage).subscribe((categoryListData) => {
        this.categories = categoryListData;
        this.setTopicData(categoryListData);
      })
    })

    this.categoryService.getAll(this.selectedLanguage).subscribe((categoryListData) => {
      this.categories = categoryListData;
      this.setTopicData(categoryListData);
      //this.dropDownManager();
    })

  }
  ngAfterViewChecked() {
    // this.dropDownManager();
  }

  hideMegaMenu() {
    document.getElementById('mega-menu-section').style.display = 'none';
  }
  showMegaMenu() {
    document.getElementById('mega-menu-section').style.display = 'block';
  }
  searchToggle(): void {
    this.searchVisible = !this.searchVisible;
  }
  setTopicData(categoryList) {
    categoryList.forEach(category => {
      this.categoryListData[category.uid] = {
        child: this.categoryService.getTopicList(category.uid, this.selectedLanguage),
        ...category
      }

    });

  }
  dropDownManager() {

    if (!document.getElementById('mega-menu-list-item'))
      return;
    document.getElementById('mega-menu-header').onmouseover = function () {
      document.getElementById('mega-menu-section').style.display = 'block';
    }

    document.getElementById('mega-menu-header').onmouseout = function () {
      document.getElementById('mega-menu-section').style.display = 'none';
    }
    document.getElementById('mega-menu-list-item').onclick = function () {
      document.getElementById('mega-menu-section').style.display = 'none';
    }
  }

}
