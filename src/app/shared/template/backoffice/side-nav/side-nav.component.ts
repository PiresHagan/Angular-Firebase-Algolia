import { Component } from '@angular/core';
import { ROUTES } from './side-nav-routes.config';
import { ThemeConstantService } from '../../../services/theme-constant.service';
import { TranslateService } from '@ngx-translate/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../../services/authentication.service';
import { STAFF } from '../../../constants/member-constant';

@Component({
    selector: 'app-sidenav',
    templateUrl: './side-nav.component.html'
})

export class SideNavComponent {

    public menuItems: any[]
    isFolded: boolean = false;
    isSideNavDark: boolean;
    isStaffAccount: boolean = false

    constructor(private themeService: ThemeConstantService,
        public translate: TranslateService,
        private afAuth: AngularFireAuth,
        private authService: AuthService) { }

    ngOnInit(): void {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
        this.themeService.isSideNavDarkChanges.subscribe(isDark => this.isSideNavDark = isDark);
        this.afAuth.authState.subscribe(() => {
            this.authService.getCustomClaimData().then((role) => {
                if (role == STAFF) {
                    this.isStaffAccount = true;
                }

            })
        })

    }
}
