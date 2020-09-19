import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

import { AppRoutingModule } from './app-routing.module';
import { TemplateModule } from './shared/template/template.module';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { CommonLayoutComponent } from './layouts/common-layout/common-layout.component';
import { FullLayoutComponent } from './layouts/full-layout/full-layout.component';
import { BackofficeLayoutComponent } from './layouts/backoffice-layout/backoffice-layout.component';

import { NgChartjsModule } from 'ng-chartjs';
import { ThemeConstantService } from './shared/services/theme-constant.service';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFireAnalyticsModule, ScreenTrackingService, UserTrackingService, CONFIG } from '@angular/fire/analytics';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { QuillModule } from 'ngx-quill';
import { AuthService } from './shared/services/authentication.service';
import { NgxStripeModule } from 'ngx-stripe';

import { TranslateLoader, TranslateModule, TranslateStore } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LanguageService } from './shared/services/language.service';
import { PreviousRouteService } from './shared/services/previous-route.service';
import { NgAisModule } from 'angular-instantsearch';
import { AuthInterceptor } from './shared/interceptor/auth.interceptor';
import { ArticleInteractionComponent } from './shared/component/article-interaction/article-interaction.component';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SeoService } from './shared/services/seo/seo.service';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};
registerLocaleData(en);

@NgModule({
    declarations: [
        AppComponent,
        CommonLayoutComponent,
        FullLayoutComponent,
        BackofficeLayoutComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CloudinaryModule.forRoot({ Cloudinary }, { cloud_name: 'mytrendingstories' } as CloudinaryConfiguration),
        NgZorroAntdModule,
        AppRoutingModule,
        TemplateModule,
        SharedModule,
        NgChartjsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAnalyticsModule,
        AngularFireMessagingModule,
        AngularFireAuthModule,
        AngularFirestoreModule,
        NgxMaskModule.forRoot(options),
        QuillModule.forRoot(),
        HttpClientModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useFactory: createTranslateLoader, deps: [HttpClient] } }),
        NgAisModule.forRoot(),
        NgxStripeModule.forRoot(environment.stripePublishableKey),
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ],
    exports: [],
    providers: [
        {
            provide: NZ_I18N,
            useValue: en_US,
        },
        TranslateStore,
        LanguageService,
        AuthService,
        PreviousRouteService,
        ScreenTrackingService,
        UserTrackingService,
        SeoService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(private routerExtService: PreviousRouteService) { }
}
export function httpTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http);
}