import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivacyComponent } from './privacy.component';
import { PrivacyEnComponent } from './privacy-en/privacy-en.component';
import { PrivacyFrComponent } from './privacy-fr/privacy-fr.component';
import { PrivacyEsComponent } from './privacy-es/privacy-es.component';

import { PrivacyRoutingModule } from './privacy-routing.module';

@NgModule({
  declarations: [
    PrivacyComponent,
    PrivacyEnComponent,
    PrivacyFrComponent,
    PrivacyEsComponent
  ],
  imports: [
    CommonModule,
    PrivacyRoutingModule
  ]
})

export class PrivacyModule { }
