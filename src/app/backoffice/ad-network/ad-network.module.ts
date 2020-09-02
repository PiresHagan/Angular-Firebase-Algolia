import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdNetworkRoutingModule } from './ad-network-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SitesComponent } from './sites/sites.component';
import { AdUnitsComponent } from './ad-units/ad-units.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [SitesComponent, AdUnitsComponent],
  imports: [
    AdNetworkRoutingModule,
    CommonModule,
    NzFormModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class AdNetworkModule { }
