import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobListComponent } from './jobsList.component';

const routes: Routes = [
  {
    path: '',
    component: JobListComponent,
    data: {
      title: 'jobs',
      headerDisplay: 'none'
    },
    runGuardsAndResolvers: 'always',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class JobsListRoutingModule { }
