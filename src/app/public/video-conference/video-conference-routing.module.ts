import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiveSessionsComponent } from './live-sessions/live-sessions.component';
import {LiveSessionComponent} from './live-session/live-session.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { BuyBackageComponent } from './buy-backage/buy-backage.component';


const routes: Routes = [
  {
    path:'',
    component:LiveSessionsComponent,
    data:{
      title:'live sessions',
      headerDisplay:'none'
    }
  },
  {
    path:':lsessionid',
    component:LiveSessionComponent,
    data:{
      title:'live session',
      headerDisplay:'none'
    }
  },
  {
    path:'vc/subscription',
    component:SubscriptionComponent,
    data:{
      title:'subscription',
      headerDisplay:'none'
    }
  },
  {
    path:'buy-package/:backageplanid',
    component:BuyBackageComponent,
    data:{
      title:'buy',
      headerDisplay:'none'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoConferenceRoutingModule { }
