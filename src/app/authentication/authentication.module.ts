import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { NetworkComponent } from './network/network.component';
import { InterestComponent } from './interest/interest.component';
import { ProfileComponent } from './profile/profile.component';
import { AgreementComponent } from './agreement/agreement.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

import { environment } from '../../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';


import { NgxMaskModule, IConfig } from 'ngx-mask';
import { MaintenanceComponent } from './maintenance/maintenance.component';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        AuthenticationRoutingModule,
        NgxMaskModule.forChild(),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule,
        TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } })

    ],
    declarations: [
        LoginComponent,
        SignUpComponent,
        NetworkComponent,
        InterestComponent,
        ProfileComponent,
        AgreementComponent,
        ResetPasswordComponent,
        MaintenanceComponent
    ]
})

export class AuthenticationModule { }