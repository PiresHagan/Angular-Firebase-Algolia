import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HairSalonHomeComponent } from './hair-salon-home/hair-salon-home.component';
import { HairSalonListComponent } from './hair-salon-list/hair-salon-list.component';
import { HairSalonDetailsComponent } from './hair-salon-details/hair-salon-details.component';


const routes: Routes = [
  {
    path:'',
    component:HairSalonHomeComponent,
    data:{
      title:'hair salon',
      headerDisplay:'none'
    }
  },
  {
    path:'hair-salon-list',
    component:HairSalonListComponent,
    data:{
      title:'hair salon list',
      headerDisplay:'none'
    }
  },
  {
    path:'hair-salon-details/:hairSalonId',
    component:HairSalonDetailsComponent,
    data:{
      title:'hair salon details',
      headerDisplay:'none'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HairSalonRoutingModule { }
