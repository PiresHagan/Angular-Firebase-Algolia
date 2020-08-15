import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule, createTranslateLoader } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

import { FundraiserRoutingModule } from './fundraiser-routing.module';
import { FundraiserListComponent } from './fundraiser-list/fundraiser-list.component';


@NgModule({
  declarations: [FundraiserListComponent],
  imports: [
    CommonModule,
    CommonModule,
    FundraiserRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    QuillModule,
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } })

  ]
})
export class FundraiserModule { }
