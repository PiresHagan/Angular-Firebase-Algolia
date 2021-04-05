import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from './about.component';

const routes: Routes = [
  {
    path: '',
    component: AboutComponent,
    data: {
      title: 'About My Trending Stories',
      headerDisplay: 'none'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutRoutingModule { }
