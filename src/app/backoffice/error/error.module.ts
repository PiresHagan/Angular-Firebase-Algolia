import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorRoutingModule } from './error-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader, SharedModule } from 'src/app/shared/shared.module';
import { HttpClient } from '@angular/common/http';


@NgModule({
  declarations: [NotFoundComponent],
  imports: [
    CommonModule,
    SharedModule,
    ErrorRoutingModule,
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } })
  ]
})
export class ErrorModule { }
