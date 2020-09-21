import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundraiserListComponent } from './fundraiser-list/fundraiser-list.component';
import { FundraiserDetailsComponent } from './fundraiser-details/fundraiser-details.component';
import { ProfileGuard } from 'src/app/shared/guard/profile.guard';

const routes: Routes = [{
  path: '',
  children: [
    {
      path: 'fundraiser-details',
      canActivate: [ProfileGuard],
      component: FundraiserDetailsComponent,
      data: {
        title: "Fundraiser Details"
      },
      children: [
        {
          path: '',
          loadChildren: () => import('./fundraiser-details/fundraiser-add/fundraiser-add.module').then(m => m.FundraiserAddModule),
        }
      ]
    },
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
