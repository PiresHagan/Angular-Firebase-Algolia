import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfluencerComponent } from './influencer.component';
import { InfluencerContactComponent } from './contact/contact.component';

const routes: Routes = [
  {
    path: '',
    component: InfluencerComponent,
    data: {
      title: 'Influencer',
      headerDisplay: 'none'
    }
  },
  {
    path: 'orders',
    component: InfluencerContactComponent,
    data: {
      title: 'Order',
      headerDisplay: 'none'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class InfluencerRoutingModule { }
