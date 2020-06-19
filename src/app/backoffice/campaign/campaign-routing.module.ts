import { NgModule } from '@angular/core';
import { SponsoredPostComponent } from './sponsored-post/sponsored-post.component';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'sponsered-post',
    component: SponsoredPostComponent,
    data: {
      title: "Campaigns",
    },
  },
];
 
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CampaignRoutingModule { }
