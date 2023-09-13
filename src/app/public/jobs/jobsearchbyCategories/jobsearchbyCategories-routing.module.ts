import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { jobsearchbyCategoriesComponent } from './jobsearchbyCategories.component';

const routes: Routes = [
  {
    path: '',
    component: jobsearchbyCategoriesComponent,
    data: {
      title: 'contact version 2',
      headerDisplay: 'none'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ContactRoutingModule { }
