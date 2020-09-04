import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StaffArticlesComponent } from './staff-articles/staff-articles.component';
import { StaffSettingsComponent } from './staff-settings/staff-settings.component';
import { AdNetworkSettingComponent } from './ad-network-setting/ad-network-setting.component';
import { ManageAdUnitsComponent } from './manage-ad-units/manage-ad-units.component';

const routes: Routes = [
  {
    path: "article",
    component: StaffArticlesComponent,
    data: {
      title: "allArticles",
    },
  },
  {
    path: "member",
    component: StaffSettingsComponent,
    data: {
      title: "memberSettings",
    },
  },
  {
    path:'ad-network',
    component:AdNetworkSettingComponent,
    data:{
      title: "Ad Network Setting",
    }
  },
  {
    path:'manage-ad-units/:siteId',
    component:ManageAdUnitsComponent,
    data:{
      title: "Manage Site Ad Units",
    }
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

