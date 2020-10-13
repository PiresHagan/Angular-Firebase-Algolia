import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

import { TermsComponent } from './terms.component';

import { TermsRoutingModule } from './terms-routing.module';
import { createTranslateLoader } from 'src/app/shared/shared.module';




@NgModule({
  declarations: [
    TermsComponent
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } }),
    TermsRoutingModule
  ]
})

export class TermsModule { }
