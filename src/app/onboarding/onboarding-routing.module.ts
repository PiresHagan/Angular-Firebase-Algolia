import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddWebsiteComponent } from './add-website/add-website.component';
import { EmailOtpComponent } from './email-otp/email-otp.component';
import { FeedComponent } from './feed/feed.component';
import { ImportContactComponent } from './import-contact/import-contact.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
    {
        path: 'login',
        component:LoginComponent ,
        data: {
            title: 'Login'
        }
    },
    {
        path: 'signup',
        component:SignUpComponent ,
        data: {
            title: 'Signup'
        }
    },
    {
        path: 'email-verify',
        component:EmailOtpComponent ,
        data: {
            title: 'Email Verify'
        }
    },
    {
        path: 'profile',
        component:ProfileComponent ,
        data: {
            title: 'Profile'
        }
    },
    {
        path: 'website',
        component:AddWebsiteComponent ,
        data: {
            title: 'Website'
        }
    },
    {
        path: 'import-contact',
        component:ImportContactComponent ,
        data: {
            title: 'Import Contact'
        }
    },
    {
        path: 'feed',
        component:FeedComponent ,
        data: {
            title: 'feed'
        }
    },
    {
        path: 'reset-password',
        component:ResetPasswordComponent ,
        data: {
            title: 'Reset Password'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class OnboardingRoutingModule { }
