import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CharityRoutingModule } from './charity-routing.module';
import { CharityListComponent } from './charity-list/charity-list.component';
import { CharityDonationComponent } from './charity-donation/charity-donation.component';
import { CharityFollowersComponent } from './charity-followers/charity-followers.component';
import { CharityDetailsComponent } from './charity-details/charity-details.component';
import { AddCharityComponent } from './add-charity/add-charity.component';
import { SharedModule, createTranslateLoader } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { CharityArticleComponent } from './charity-article/charity-article.component';
import { CharityFundraisersComponent } from './charity-fundraisers/charity-fundraisers.component';


@NgModule({
  declarations: [CharityListComponent, CharityDonationComponent, CharityFollowersComponent, CharityDetailsComponent, AddCharityComponent, CharityArticleComponent, CharityFundraisersComponent],
  imports: [
    CommonModule,
    CharityRoutingModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    QuillModule,
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } })

  ]
})
export class CharityModule { }
