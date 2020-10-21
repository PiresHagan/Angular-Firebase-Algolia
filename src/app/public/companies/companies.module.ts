import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';

import { CompaniesComponent } from './companies.component';
import { CompanyFollowerListComponent } from './company/company-follower-list/company-follower-list.component';
import { CompanyLeadFormComponent } from './company/company-lead-form/company-lead-form.component';
import { CompanyComponent } from './company/company.component';

import { CompaniesRoutingModule } from './companies-routing.module';
import { createTranslateLoader } from 'src/app/shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CompaniesComponent,
    CompanyComponent,
    CompanyLeadFormComponent,
    CompanyFollowerListComponent
  ],
  imports: [
    CloudinaryModule.forRoot({ Cloudinary }, { cloud_name: 'mytrendingstories' } as CloudinaryConfiguration),
    CommonModule,
    CompaniesRoutingModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } })
  ]
})
export class CompaniesModule { }
