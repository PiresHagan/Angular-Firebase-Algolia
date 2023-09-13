import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { jobCandidateDetailComponent } from './jobCandidateDetail.component';

const routes: Routes = [
  {
    path: '',
    component: jobCandidateDetailComponent,
    data: {
      title: 'jobCandidateDetail version 2',
      headerDisplay: 'none'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class jobCandidateDetailRoutingModule { }
