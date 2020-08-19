import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule, createTranslateLoader } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http'

import { FundraiserAddRoutingModule } from './fundraiser-add-routing.module';
import { FundraiserContentComponent } from './fundraiser-content/fundraiser-content.component';
import { FundraiserSeoComponent } from './fundraiser-seo/fundraiser-seo.component';
import { FundraiserImageComponent } from './fundraiser-image/fundraiser-image.component';
import { FundraiserPublishComponent } from './fundraiser-publish/fundraiser-publish.component';


@NgModule({
  declarations: [FundraiserContentComponent, FundraiserSeoComponent, FundraiserImageComponent, FundraiserPublishComponent],
  imports: [
    CommonModule,
    CommonModule,
    FundraiserAddRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    QuillModule,
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } })

  ]
})
export class FundraiserAddModule { }
