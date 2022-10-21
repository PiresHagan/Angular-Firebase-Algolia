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
  isMenuHidden: boolean = true;
  categoryListData = {};
  categories: Category[];
  searchVisible: boolean = false;
  selectedLanguage: string;
  isLoggedInUser: boolean = false;
  photoURL: string;
  displayName: string;
  countryWiseCityData = new Map;
  countryListArray = [];

  // Predefined sequence of countries as shared by Sunny
  countrySequenceData = ['USA', 'Canada', 'France', 'China', 'United Kingdom', 'Australia', 'Brazil', 'India', 'Italy', 'Agentina', 'Japan', 'Germany', 'South Korea', 'South Africa', 'Spain', 'Switzerland', 'United Arab Emirates', 'Chile', 'Costa Rica', 'Greece', 'Nigeria', 'Indonesia', 'Panama', 'Peru', 'Portugal'];
  countrySequenceDataFr = ['États-Unis', 'Canada', 'France', 'Chine', 'Royaume-Uni', 'Australie', 'Brésil', 'Inde', 'Italie', 'Agentina', 'Japon', 'Allemagne', 'Corée du Sud', 'Afrique du Sud', 'Espagne', 'Suisse', 'Emirats Arabes Unis', 'Chili', 'Costa Rica', 'Grèce', 'Nigeria', 'Indonésie', 'Panama', 'Pérou', 'Portugal'];
  countrySequenceDataEs = ['Estados Unidos', 'Canadá', 'Francia', 'China', 'Reino Unido', 'Australia', 'Brasil', 'India', 'Italia', 'Agentina', 'Japón', 'Alemania', 'Corea del Sur', 'Sudáfrica', 'España', 'Suiza', 'Emiratos Arabes Unidos', 'Chile', 'Costa Rica', 'Grecia', 'Nigeria', 'Indonesia', 'Panamá', 'Perú', 'Portugal'];

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
    this.countryListArray = [];
  }

  hideMegaMenuCity() {
    document.getElementById('mega-menu-section-city').style.display = 'none';
    this.countryListArray = [];
  }

  showCityMegaMenu() {
    document.getElementById('mega-menu-section-city').style.display = 'block';
    this.megaMenuData();
  }

  showMoreMegaMenu() {
    document.getElementById('mega-menu-section').style.display = 'block';
    this.megaMenuData();
  }

  megaMenuData() {
    this.categories.forEach(category=> {
      if(category?.title == "City" || category?.title == "Ciudad" || category?.title == "Ville"){
        this.categoryListData[category.uid].child.subscribe((data) => {
          
          let countries = data.map(city => { 
            let splittedData = city.title.split(", ");
            return splittedData[splittedData.length - 1];
          });
          if(this.selectedLanguage == "fr"){
            countries = [...this.countrySequenceDataFr, ...countries].filter((country, index, self) => index === self.indexOf(country));
          } else if(this.selectedLanguage == "es"){
            countries = [...this.countrySequenceDataEs, ...countries].filter((country, index, self) => index === self.indexOf(country));
          } else {
            countries = [...this.countrySequenceData, ...countries].filter((country, index, self) => index === self.indexOf(country));
          }
          countries.forEach(country => {
            let cityArray = [];

            data.forEach(city => {
              if(city.title.includes(country))
                cityArray.push({title: city.title, slug: city.slug})
            });

            cityArray = cityArray.sort((a, b) => (a.title > b.title) ? 1 : -1);
            this.countryListArray = [...this.countryListArray, ...cityArray];
          });
        });
      }
    })
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
    this.hideMenu();
    this.router.navigate(["/auth/login"]);
  }

  routeSignup(): void {
    this.hideMenu();
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

  hideMenu() {
    this.isMenuHidden = true;
  }

}
