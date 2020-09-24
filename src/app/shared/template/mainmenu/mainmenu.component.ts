import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../interfaces/category.type';
import { Observable } from 'rxjs';
import { LanguageService } from '../../services/language.service';
import { TranslateService, LangChangeEvent } from "@ngx-translate/core";
import { Router } from '@angular/router';
import { AuthService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
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
  isLoggedInUser: boolean = false;
  photoURL: string;
  displayName: string;
  constructor(
        private categoryService: CategoryService,
        private languageService: LanguageService,
        private translate: TranslateService,
        private router: Router,
        private authService: AuthService,
        public userService: UserService,
        ) { }

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
    this.authService.getAuthState().subscribe(user => {
      if (user && !user.isAnonymous) {
          this.isLoggedInUser = true;
      } else {
          this.isLoggedInUser = false;
      }
  });
  this.userService.getCurrentUser().then((user) => {
    this.userService.getMember(user.uid).subscribe((userDetails) => {
        this.isLoggedInUser = true;
        this.photoURL = userDetails?.avatar?.url;
        this.displayName = userDetails?.fullname;
    })
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
  routeLogin(): void {
    this.router.navigate(["/auth/login"]);

}
routeSignup(): void {
    this.router.navigate(["/auth/signup"]);

}
signOut(): void {
    this.authService.signout().then(() => {
        this.isLoggedInUser = false;
    })
}
isCollapsed = false;

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
