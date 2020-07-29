import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CharityDetailsComponent } from './charity-details/charity-details.component';
import { CharityListComponent } from './charity-list/charity-list.component';



const routes: Routes = [{
  path: '',
  children: [
    {
      path: 'charity-details',
      component: CharityDetailsComponent,
      data: {
        title: "CharityDetails"
      },
    },
    {
      path: 'charity-list',
      component: CharityListComponent,
      data: {
        title: "CharityList"
      }
    }
  ]
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CharityRoutingModule { }
