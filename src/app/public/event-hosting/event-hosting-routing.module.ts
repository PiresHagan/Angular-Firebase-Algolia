import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EventDetailsComponent } from "./event-details/event-details.component";
import { EventListComponent } from "./event-list/event-list.component";
import { EventsByTypeListComponent } from "./events-by-type-list/events-by-type-list.component";
import { BookingEventComponent } from "./booking-event/booking-event.component";
import {EventHomeComponent} from "./event-home/event-home.component";
const routes: Routes = [
  
  /*
{
  path: '',
  component: HostListComponent,
  data: {
    title: "Hosts"
  }
},
{
  path: 'groups',
  component: GroupListComponent,
  data: {
    title: "Groups"
  }
.},*/
  {
    path: "book/:eventslug",
    component: BookingEventComponent,
    data: {
      title: "BookingEvent",
    },
  },
  {
    path: "",
    component: EventListComponent,
    data: {
      title: "Events",
    },
  },
  {
    path: "home",
    component: EventHomeComponent,
    data: {
      title: "Events",
    },
},
  {
    path: ":eventType",
    component: EventsByTypeListComponent,
    data: {
      title: "Events",
    },
  },
  {
    path: ":eventType/:eventslug",
    component: EventDetailsComponent,
    data: {
      title: "Events",
    },
  },
    

  /*
{
  path: 'group-details/:groupid',
  component: GroupDetailsComponent,
  data: {
    title: "GroupDetails"
  }
},

{
  path: 'host-details/:hostid',
  component: HostDetailsComponent,
  data: {
    title: "HostDetails"
  }
},*/
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventHostingRoutingModule {}
