import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StaffArticlesComponent } from './staff-articles/staff-articles.component';
import { StaffSettingsComponent } from './staff-settings/staff-settings.component';

const routes: Routes = [
  {
    path: "article",
    component: StaffArticlesComponent,
    data: {
      title: "Article List",
    },
  },
  {
    path: "member",
    component: StaffSettingsComponent,
    data: {
      title: "Staff Profile Access",
    },
  },
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

