import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FundraiserListComponent } from './fundraiser-list.component';
import { FundraiserComponent } from './fundraiser/fundraiser.component';

const routes: Routes = [
  {
    path: '',
    component: FundraiserListComponent,
    data: {
      title: 'fundraisers',
      headerDisplay: 'none'
    }
  },
  {
    path: ':slug',
    component: FundraiserComponent,
    data: {
      title: 'fundraiser',
      headerDisplay: 'none'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FundraiserListRoutingModule { }
