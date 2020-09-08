import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdNetworkRoutingModule } from './ad-network-routing.module';
import { SharedModule, createTranslateLoader } from 'src/app/shared/shared.module';
import { SitesComponent } from './sites/sites.component';
import { AdUnitsComponent } from './ad-units/ad-units.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';



@NgModule({
  declarations: [SitesComponent, AdUnitsComponent],
  imports: [
    AdNetworkRoutingModule,
    CommonModule,
    NzFormModule,
    NzTypographyModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } })
  ]
})
export class AdNetworkModule { }
