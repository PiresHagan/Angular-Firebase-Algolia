import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompaniesComponent } from './companies.component';
import { CompanyComponent } from './company/company.component';

const routes: Routes = [
  {
    path: '',
    component: CompaniesComponent,
    data: {
      title: 'companies',
      headerDisplay: 'none'
    }
  },
  {
    path: ':slug',
    component: CompanyComponent,
    data: {
      title: 'company',
      headerDisplay: 'none'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CompaniesRoutingModule { }
