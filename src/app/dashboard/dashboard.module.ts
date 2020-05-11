import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { ThemeConstantService } from '../shared/services/theme-constant.service';

import { DefaultDashboardComponent } from './default/default-dashboard.component';
import { WithBreadcrumbDashboardComponent } from './with-breadcrumb/with-breadcrumb-dashboard.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        DashboardRoutingModule,
        TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } })

    ],

    declarations: [
        DefaultDashboardComponent,
        WithBreadcrumbDashboardComponent
    ],
    providers: [
        ThemeConstantService
    ],
})
export class DashboardModule { }
