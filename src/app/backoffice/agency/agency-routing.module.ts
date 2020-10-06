import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgencyComponent } from './agency.component';


const routes: Routes = [
  {
    path: 'campaign-manager',
    component: AgencyComponent,
    data: {
      title: "Agency",
    }

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgencyRoutingModule { }
