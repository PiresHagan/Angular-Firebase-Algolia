import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SitesComponent } from './sites/sites.component';
import { AdUnitsComponent } from './ad-units/ad-units.component';



const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'sites',
        component: SitesComponent,
        data: {
          title: "My Sites"
        }
      },
      {
        path: 'ad-units/:siteId',
        component: AdUnitsComponent,
        data: {
          title: "Ad units"
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdNetworkRoutingModule { }
