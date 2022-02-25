import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/guard/auth.guard';
import { STAFF } from '../shared/constants/member-constant';


const routes: Routes = [
  // {
  //   path: 'article',
  //   loadChildren: () => import('./articles/articles.module').then(m => m.ArticlesModule)
  // },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
  },
  {
    path: 'campaign',
    loadChildren: () => import('./campaign/campaign.module').then(m => m.CampaignModule)
  },
  {
    path: 'error',
    loadChildren: () => import('./error/error.module').then(m => m.ErrorModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard],
    data: { roles: [STAFF], title: "Admin", }
  },
  {
    path: 'company',
    loadChildren: () => import('./company/company.module').then(m => m.CompanyModule),
  },
  {
    path: 'charity',
    loadChildren: () => import('./charity/charity.module').then(m => m.CharityModule),
  },
  {
    path: 'fundraiser',
    loadChildren: () => import('./fundraiser/fundraiser.module').then(m => m.FundraiserModule),
  },
  {
    path: 'ad-network',
    loadChildren: () => import('./ad-network/ad-network.module').then(m => m.AdNetworkModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeRoutingModule { }
