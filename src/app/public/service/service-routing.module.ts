import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiceComponent } from './service.component';
import { ServiceCatagoryComponent } from './service-catagory-list/service-list.component';


const routes: Routes = [
  {
    path: 'category/:catagoryslug',
    component: ServiceComponent,
    data: {
      title: 'Service ',
      headerDisplay: 'none'
    },

  },
  {
    path: '',
    component: ServiceCatagoryComponent,
    data: {
      title: 'Service Catagory ',
      headerDisplay: 'none'
    }
  },
  {
    path: ':userSlug/:slug',
    loadChildren: () => import('../servicesingle/service.module').then(m => m.ServiceModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ServiceRoutingModule { }
