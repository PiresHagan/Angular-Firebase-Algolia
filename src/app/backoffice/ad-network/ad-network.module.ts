import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdNetworkRoutingModule } from './ad-network-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SitesComponent } from './sites/sites.component';



@NgModule({
  declarations: [SitesComponent],
  imports: [
    CommonModule,
    AdNetworkRoutingModule,
    SharedModule
  ]
})
export class AdNetworkModule { }
