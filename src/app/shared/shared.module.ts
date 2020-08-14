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
import { ImgSizePipe } from './pipes/img-size.pipe';
import { ArticleInteractionComponent } from './component/article-interaction/article-interaction.component';
import { ArticleAvatarComponent } from './component/article-avatar/article-avatar.component';
import { HomeArticleComponent } from './component/home-article/home-article.component';
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
        SearchPipe,
        ArticleInteractionComponent,
        ArticleAvatarComponent,
        HomeArticleComponent
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
        ImgSizePipe,
        ArticleInteractionComponent,
        ArticleAvatarComponent,
        HomeArticleComponent

    ],

    providers: [
        ThemeConstantService
    ]
})

export class SharedModule { }
