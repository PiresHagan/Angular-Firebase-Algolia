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
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFireAnalyticsModule, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
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
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { LoadingInterceptor } from './incterceptors/loading.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


registerLocaleData(en);

@NgModule({
    declarations: [
        AppComponent,
        CommonLayoutComponent,
        FullLayoutComponent,
        BackofficeLayoutComponent
    ],
    imports: [
        AngularFireModule.initializeApp(environment.firebase),
        BrowserModule,
        BrowserAnimationsModule,
        CloudinaryModule.forRoot({ Cloudinary }, { cloud_name: 'mytrendingstories' } as CloudinaryConfiguration),
        NgZorroAntdModule,
        AppRoutingModule,
        TemplateModule,
        SharedModule,
        AngularFireAnalyticsModule,
        AngularFireMessagingModule,
        AngularFireAuthModule,
        AngularFirestoreModule,
        QuillModule.forRoot(),
        HttpClientModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useFactory: createTranslateLoader, deps: [HttpClient] } }),
        NgAisModule.forRoot(),
        NgxStripeModule.forRoot(environment.stripePublishableKey),
        NzSpinModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        ToastrModule.forRoot({
          timeOut: 3000,
          positionClass: 'toast-bottom-right',
        }),
        FontAwesomeModule,
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
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

export function httpTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
