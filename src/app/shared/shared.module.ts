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
import { CloudinaryImgComponent } from './component/cloudinary-img/cloudinary-img.component';
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';
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
        CloudinaryImgComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        NgZorroAntdModule,
        PerfectScrollbarModule,
        CloudinaryModule.forRoot({ Cloudinary }, { cloud_name: 'mytrendingstories' } as CloudinaryConfiguration),
        TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } })
    ],
    declarations: [
        SearchPipe,
        StripTagsPipe,
        ImgSizePipe,
        ArticleInteractionComponent,
        ArticleAvatarComponent,
        CloudinaryImgComponent
    ],

    providers: [
        ThemeConstantService
    ]
})

export class SharedModule { }
