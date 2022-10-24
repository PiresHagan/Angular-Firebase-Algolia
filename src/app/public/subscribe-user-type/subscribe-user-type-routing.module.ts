import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubscribeUserTypeComponent } from './subscribe-user-type.component';


const routes: Routes = [
  {
    path: '',
    component: SubscribeUserTypeComponent,
    data: {
      title: '',
      headerDisplay: 'none'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SubscribeUserTypeRoutingModule { }
