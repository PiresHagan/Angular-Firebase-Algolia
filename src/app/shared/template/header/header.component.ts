import { Component, EventEmitter, Output } from '@angular/core';
import { ThemeConstantService } from '../../services/theme-constant.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authentication.service';
import { LanguageService } from '../../services/language.service';
import { Language } from '../../interfaces/language.type';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { environment } from 'src/environments/environment';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})

export class HeaderComponent {

    @Output() langChanged: EventEmitter<string> = new EventEmitter();
    searchVisible: boolean = false;
    quickViewVisible: boolean = false;
    isFolded: boolean;
    isExpand: boolean;
    isLoggedInUser: boolean = false;
    languageList: Language[];
    selectedLanguage: string;
    photoURL: string;
    displayName: string;


    constructor(
        private themeService: ThemeConstantService,
        public translate: TranslateService,
        private router: Router,
        private authService: AuthService,
        public languageService: LanguageService,
        public userService: UserService,
        private categoryService: CategoryService,

    ) {

    }
    switchLang(lang: string) {
        this.languageService.changeLang(lang);
    }


    ngOnInit(): void {
        this.themeService.isMenuFoldedChanges.subscribe(isFolded => this.isFolded = isFolded);
        this.themeService.isExpandChanges.subscribe(isExpand => this.isExpand = isExpand);

        this.authService.getAuthState().subscribe(user => {
            if (user && !user.isAnonymous) {
                this.isLoggedInUser = true;
            } else {
                this.isLoggedInUser = false;
            }
        });
        this.languageList = this.languageService.geLanguageList();
        this.selectedLanguage = this.languageService.defaultLanguage;

        this.userService.getCurrentUser().then((user) => {
            this.userService.getMember(user.uid).subscribe((userDetails) => {
                this.isLoggedInUser = true;
                this.photoURL = userDetails?.avatar?.url ? userDetails?.avatar?.url.replace('http://', 'https://') : '';
                this.displayName = userDetails?.fullname;
            })
        })

    }

    toggleFold() {
        this.isFolded = !this.isFolded;
        this.themeService.toggleFold(this.isFolded);
    }

    toggleExpand() {
        this.isFolded = false;
        this.isExpand = !this.isExpand;
        this.themeService.toggleExpand(this.isExpand);
        this.themeService.toggleFold(this.isFolded);
    }

    searchToggle(): void {
        this.searchVisible = !this.searchVisible;
    }

    quickViewToggle(): void {
        this.quickViewVisible = !this.quickViewVisible;
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


    removeActiveClass() {
        this.categoryService.getAll(this.selectedLanguage).subscribe((categoryListData) => {
            categoryListData.forEach(category => {
                const el = document.querySelector('.' + category['slug']);
                el.classList.remove("ant-menu-item-selected");
            });
        })
    }

    goToConsole() {
        if(this.userService.userData?.isNewConsoleUser) {
            this.authService.redirectToConsole(`${environment.consoleURL}/settings/profile-settings`, {});
        } else {
            this.authService.redirectToConsole(`${environment.consoleURL}/settings/profile-settings`, {});
        }
    }

}
