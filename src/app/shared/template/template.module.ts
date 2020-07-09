import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";

import { SharedModule } from '../shared.module';

import { HeaderComponent } from "./header/header.component";
import { SearchComponent } from "./search/search.component";
import { QuickViewComponent } from './quick-view/quick-view.component';
import { SideNavComponent } from "./backoffice/side-nav/side-nav.component";
import { FooterComponent } from "./footer/footer.component";

import { SideNavDirective } from "../directives/side-nav.directive";
import { ThemeConstantService } from '../services/theme-constant.service';
import { HeaderBackofficeComponent } from './backoffice/header-backoffice/header-backoffice.component';
import { MainmenuComponent } from './mainmenu/mainmenu.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FooterBackofficeComponent } from './backoffice/footer-backoffice/footer-backoffice.component';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}



@NgModule({
    exports: [
        HeaderComponent,
        SearchComponent,
        QuickViewComponent,
        SideNavComponent,
        SideNavDirective,
        FooterComponent,
        HeaderBackofficeComponent,
        FooterBackofficeComponent,
        MainmenuComponent

    ],
    imports: [
        RouterModule,
        SharedModule,
        TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } })

    ],
    declarations: [
        HeaderComponent,
        SearchComponent,
        QuickViewComponent,
        SideNavComponent,
        SideNavDirective,
        FooterComponent,
        HeaderBackofficeComponent,
        MainmenuComponent,
        FooterBackofficeComponent
    ],
    providers: [
        ThemeConstantService
    ],

})

export class TemplateModule { }
