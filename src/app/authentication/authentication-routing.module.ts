import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { NetworkComponent } from "./network/network.component";
import { FeedComponent } from "./feed/feed.component";
import { ProfileComponent } from "./profile/profile.component";
import { AgreementComponent } from "./agreement/agreement.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { AuthGuard } from "../shared/guard/auth.guard";
import { ImportContactComponent } from "./import-contact/import-contact.component";
import { EmailOtpComponent } from "./email-otp/email-otp.component";
import { AddWebsiteComponent } from "./add-website/add-website.component";
import { CompanyComponent } from "./company/company.component";
import { PendingComponent } from "./pending/pending.component";
import { ComingSoonComponent } from "./coming-soon/coming-soon.component";
import { RestrictProfileGuard } from "../shared/guard/restrict-profile.guard";

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    data: {
      title: "Login",
    },
  },
  {
    path: "reset-password",
    component: ResetPasswordComponent,
    data: {
      title: "Reset password",
    },
  },
  {
    path: "signup",
    component: SignUpComponent,
    data: {
      title: "Sign Up",
    },
  },
  {
    path: "agreement",
    component: AgreementComponent,
    data: {
      title: "Agreement",
    },
  },
  {
    path: "network",
    component: NetworkComponent,
    data: {
      title: "Invite your network",
    },
    canActivate: [AuthGuard],
  },
  {
    path: "feed",
    component: FeedComponent,
    data: {
      title: "Welcome to your feed",
    },
    canActivate: [AuthGuard],
  },
  {
    path: "email-verify",
    component: EmailOtpComponent,
    data: {
      title: "Email Verify",
    },
  },
  {
    path: "website",
    component: AddWebsiteComponent,
    data: {
      title: "Website",
    },
    canActivate: [AuthGuard],
  },
  {
    path: "profile",
    component: ProfileComponent,
    data: {
      title: "Complete your profile",
    },
    canActivate: [AuthGuard, RestrictProfileGuard],
  },
  {
    path: "import-contact",
    component: ImportContactComponent,
    data: {
      title: "Import Your Contact",
    },
    canActivate: [AuthGuard],
  },
  {
    path: "company",
    component: CompanyComponent,
    data: {
      title: "Company",
    },
    canActivate: [AuthGuard],
  },
  {
    path: "pending",
    component: PendingComponent,
    data: {
      title: "Pending",
    },
    canActivate: [AuthGuard],
  },
  {
    path: "coming-soon",
    component: ComingSoonComponent,
    data: {
      title: "Coming soon",
    },
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
