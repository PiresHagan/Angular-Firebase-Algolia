import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { SharedModule, createTranslateLoader } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { NetworkComponent } from './network/network.component';
import { FeedComponent } from './feed/feed.component';
import { ProfileComponent } from './profile/profile.component';
import { AgreementComponent } from './agreement/agreement.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AddWebsiteComponent } from './add-website/add-website.component';
import { EmailOtpComponent } from './email-otp/email-otp.component';

import { environment } from '../../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { MaintenanceComponent } from './maintenance/maintenance.component';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { ImportContactComponent } from './import-contact/import-contact.component';
import { LanguageService } from '../shared/services/language.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CompanyComponent } from './company/company.component';
import { PendingComponent } from './pending/pending.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        AuthenticationRoutingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule,
        NgxSpinnerModule,
        TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } })

    ],
    declarations: [
        AddWebsiteComponent,
        EmailOtpComponent,
        LoginComponent,
        SignUpComponent,
        NetworkComponent,
        FeedComponent,
        ProfileComponent,
        AgreementComponent,
        ResetPasswordComponent,
        MaintenanceComponent,
        ImportContactComponent,
        CompanyComponent,
        PendingComponent,
        ComingSoonComponent
    ],
    providers: [LanguageService],
})

export class AuthenticationModule { }
