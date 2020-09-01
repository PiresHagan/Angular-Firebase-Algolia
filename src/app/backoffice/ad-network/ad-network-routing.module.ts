import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SitesComponent } from './sites/sites.component';



const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'sites',
        component: SitesComponent,
        data: {
          title: "myArticles"
        }
      }
        ]
     
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdNetworkRoutingModule { }
