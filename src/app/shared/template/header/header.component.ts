import { Component, EventEmitter, Output } from '@angular/core';
import { ThemeConstantService } from '../../services/theme-constant.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authentication.service';
import { LanguageService } from '../../services/language.service';
import { Language } from '../../interfaces/language.type';
import { UserService } from '../../services/user.service';
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

    ) {

    }
    switchLang(lang: string) {
        this.languageService.changeLang(lang);
        this.langChanged.emit(lang);
        this.translate.use(lang);
    }


    ngOnInit(): void {
        this.themeService.isMenuFoldedChanges.subscribe(isFolded => this.isFolded = isFolded);
        this.themeService.isExpandChanges.subscribe(isExpand => this.isExpand = isExpand);

        this.authService.getAuthState().subscribe(isLoggedInUser => {
            if (isLoggedInUser) {
                this.isLoggedInUser = true;
            } else {
                this.isLoggedInUser = false;
            }
        });
        this.languageList = this.languageService.geLanguageList();
        this.selectedLanguage = this.languageService.defaultLanguage;

        this.userService.getCurrentUser().then((user) => {
            this.userService.get(user.uid).subscribe((userDetails) => {
                this.isLoggedInUser = true;
                this.photoURL = userDetails.photoURL;
                this.displayName = userDetails.displayName;
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


    notificationList = [
        {
            title: 'You received a new message',
            time: '8 min',
            icon: 'mail',
            color: 'ant-avatar-' + 'blue'
        },
        {
            title: 'New user registered',
            time: '7 hours',
            icon: 'user-add',
            color: 'ant-avatar-' + 'cyan'
        },
        {
            title: 'System Alert',
            time: '8 hours',
            icon: 'warning',
            color: 'ant-avatar-' + 'red'
        },
        {
            title: 'You have a new update',
            time: '2 days',
            icon: 'sync',
            color: 'ant-avatar-' + 'gold'
        }
    ];
}
