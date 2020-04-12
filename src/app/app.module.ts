import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
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
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { QuillModule } from 'ngx-quill';


export const options: Partial<IConfig> | (() => Partial<IConfig>) ={};
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
        NgZorroAntdModule,
        AppRoutingModule,
        TemplateModule,
        SharedModule,
        NgChartjsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule,
        NgxMaskModule.forRoot(options),
        QuillModule.forRoot(),
    ],
    providers: [
        { 
            provide: NZ_I18N,
            useValue: en_US, 
        },
        ThemeConstantService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
