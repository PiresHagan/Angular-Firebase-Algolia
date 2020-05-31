import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from "@angular/router";
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ThemeConstantService } from './services/theme-constant.service';
import { SearchPipe } from './pipes/search.pipe';
import { StripTagsPipe } from './pipes/striptags.pipe';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ScrollableDirective } from './directives/scrollable.directive';
import { ImgSizePipe } from './pipes/img-size.pipe';
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
    exports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        NgZorroAntdModule,
        PerfectScrollbarModule,
        SearchPipe
    ],
    imports: [
        RouterModule,
        CommonModule,
        NgZorroAntdModule,
        PerfectScrollbarModule,
        TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } })
    ],
    declarations: [
        SearchPipe,
        StripTagsPipe,
        ScrollableDirective,
        ImgSizePipe,
    ],
    providers: [
        ThemeConstantService
    ]
})

export class SharedModule { }
