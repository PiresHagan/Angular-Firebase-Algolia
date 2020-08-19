import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyListComponent } from './company-list/company-list.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';


const routes: Routes = [{
  path: '',
  children: [
    {
      path: 'company-details',
      component: CompanyDetailsComponent,
      data: {
        title: "CompanyDetails"
      },
    },
    {
      path: 'company-list',
      component: CompanyListComponent,
      data: {
        title: "CompanyList"
      }
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
