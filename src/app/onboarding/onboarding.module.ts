import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { EmailOtpComponent } from './email-otp/email-otp.component';
import { ProfileComponent } from './profile/profile.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AddWebsiteComponent } from './add-website/add-website.component';
import { ImportContactComponent } from './import-contact/import-contact.component';
import { FeedComponent } from './feed/feed.component';
import { OnboardingRoutingModule } from './onboarding-routing.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { SharedModule, createTranslateLoader } from '../shared/shared.module';
import { LanguageService } from '../shared/services/language.service';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [LoginComponent, SignUpComponent, EmailOtpComponent, ProfileComponent, ResetPasswordComponent, AddWebsiteComponent, ImportContactComponent, FeedComponent],
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    SharedModule,
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } }),
    ReactiveFormsModule
  ],
  providers: [LanguageService]
})
export class OnboardingModule { }
