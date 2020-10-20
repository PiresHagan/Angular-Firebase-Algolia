import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CharityListComponent } from './charity-list.component';
import { CharityComponent } from './charity/charity.component';

const routes: Routes = [
  {
    path: '',
    component: CharityListComponent,
    data: {
      title: 'charities',
      headerDisplay: 'none'
    }
  },
  {
    path: ':slug',
    component: CharityComponent,
    data: {
      title: 'charity',
      headerDisplay: 'none'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CharityListRoutingModule { }
