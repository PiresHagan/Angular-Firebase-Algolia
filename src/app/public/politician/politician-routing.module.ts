import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PoliticianComponent } from './politician.component';
import { SinglePoliticianComponent } from './single-politician/single-politician.component';


const routes: Routes = [
  {
    path: '',
    component: PoliticianComponent,
    data: {
      title: 'Politician',
      headerDisplay: 'none'
    }
  },
  {
    path: ':userSlug/:slug',
    component: SinglePoliticianComponent,
    data: {
      title: 'Politician',
      headerDisplay: 'none'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PoliticianRoutingModule { }
