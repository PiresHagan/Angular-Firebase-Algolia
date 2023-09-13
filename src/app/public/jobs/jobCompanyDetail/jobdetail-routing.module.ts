import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobDetailComponent } from './jobdetail.component';

const routes: Routes = [
  {
    path: '',
    component: JobDetailComponent,
    data: {
      title: 'job version 2',
      headerDisplay: 'none'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class JobDetailRoutingModule { }
