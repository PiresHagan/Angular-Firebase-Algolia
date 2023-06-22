import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddGroupComponent } from './add-group/add-group.component';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { GroupPackagesComponent } from './group-packages/group-packages.component'


const routes: Routes = [
  {
    path: "details/:group_slug",
    component: GroupDetailsComponent,
    data: {
      title: "groups",
    },
  },
  {
    path: "",
    component: GroupsListComponent,
    data: {
      title: "groups",
    },
  },
 
  {
    path: "new/:event_type/:event_slug",
    component: AddGroupComponent,
    data: {
      title: "add-groups",
    },
  },
  {
    path: "new",
    component: AddGroupComponent,
    data: {
      title: "add-groups",
    },
  },
    {
      path: "subscribe/:group_id",
      component: GroupPackagesComponent,
      data: {
        title: "subscribe-group",
      },
    },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }
