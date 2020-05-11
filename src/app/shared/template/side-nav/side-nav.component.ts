import { Component } from '@angular/core';
import { ROUTES } from './side-nav-routes.config';
import { ThemeConstantService } from '../../services/theme-constant.service';
import { skip } from 'rxjs/operators';

@Component({
    selector: 'app-sidenav',
    templateUrl: './side-nav.component.html'
})

export class SideNavComponent {

    public menuItems: any[]
    isFolded: boolean = false;
    isSideNavDark: boolean;

    constructor(private themeService: ThemeConstantService) { }

    ngOnInit(): void {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
        this.themeService.isSideNavDarkChanges.subscribe(isDark => this.isSideNavDark = isDark);
    }
}
