import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";

import { SharedModule } from '../shared.module';

import { HeaderComponent } from "./header/header.component";
import { SearchComponent } from "./search/search.component";
import { QuickViewComponent } from './quick-view/quick-view.component';
import { SideNavComponent } from "./side-nav/side-nav.component";
import { FooterComponent } from "./footer/footer.component";

import { SideNavDirective } from "../directives/side-nav.directive";
import { ThemeConstantService } from '../services/theme-constant.service';
import { HeaderBackofficeComponent } from './header/header-backoffice.component';
import { MainmenuComponent } from './mainmenu/mainmenu.component';

@NgModule({
    exports: [
        HeaderComponent,
        SearchComponent,
        QuickViewComponent,
        SideNavComponent,
        SideNavDirective,
        FooterComponent,
        HeaderBackofficeComponent,
        MainmenuComponent,
    ],
    imports: [
        RouterModule,
        SharedModule
    ],
    declarations: [
        HeaderComponent,
        SearchComponent,
        QuickViewComponent,
        SideNavComponent,
        SideNavDirective,
        FooterComponent,
        HeaderBackofficeComponent,
        MainmenuComponent
    ],
    providers: [ 
        ThemeConstantService
    ]
})

export class TemplateModule { }
