import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { jobsearchbyCandidatesComponent } from './jobsearchbyCandidates.component';

const routes: Routes = [
  {
    path: '',
    component: jobsearchbyCandidatesComponent,
    data: {
      title: 'jobsearchbyCandidates version 2',
      headerDisplay: 'none'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class jobsearchbyCandidatesRoutingModule { }
