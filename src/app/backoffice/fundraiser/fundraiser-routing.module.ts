import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundraiserListComponent } from './fundraiser-list/fundraiser-list.component';

const routes: Routes = [{
  path: '',
  children: [
    {
      path: 'fundraiser-list',
      component: FundraiserListComponent,
      data: {
        title: "Fundraiser List"
      }
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FundraiserRoutingModule { }
