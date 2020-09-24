import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule, createTranslateLoader } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { CompanyRoutingModule } from './company-routing.module';

import { AddCompanyComponent } from './add-company/add-company.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { CompanyFollowersComponent } from './company-followers/company-followers.component';
import { CompanyLeadsComponent } from './company-leads/company-leads.component';
import { CompanyArticleComponent } from './company-article/company-article.component';
import { CompanyFundraisersComponent } from './company-fundraisers/company-fundraisers.component';
import { CompanySubscriptionComponent } from './company-subscription/company-subscription.component';
import { CompanyBillingComponent } from './company-billing/company-billing.component';
import { CompanyLeadsPackageComponent } from './company-leads-package/company-leads-package.component';
import { MonthlyLeadsComponent } from './company-leads/monthly-leads/monthly-leads.component';

@NgModule({
  declarations: [
    AddCompanyComponent, 
    CompanyListComponent, 
    CompanyDetailsComponent, 
    CompanyFollowersComponent, 
    CompanyLeadsComponent, 
    CompanyArticleComponent, 
    CompanyFundraisersComponent, 
    CompanySubscriptionComponent, 
    CompanyBillingComponent, 
    CompanyLeadsPackageComponent, 
    MonthlyLeadsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    CompanyRoutingModule,
    QuillModule,
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } })
  ]
})
export class CompanyModule { }

