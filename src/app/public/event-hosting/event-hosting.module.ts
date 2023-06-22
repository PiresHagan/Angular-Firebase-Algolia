import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';
import { createTranslateLoader, SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';


import { EventHostingRoutingModule } from './event-hosting-routing.module';
// import { GroupDetailsComponent } from './group-details/group-details.component';
// import { GroupListComponent } from './group-list/group-list.component';
//import { HostListComponent } from './host-list/host-list.component';
// import { HostDetailsComponent } from './host-details/host-details.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventsByTypeListComponent } from './events-by-type-list/events-by-type-list.component';
import { ArticleCommentsComponent } from './event-comments/event-comments.component';
import { BookingEventComponent } from './booking-event/booking-event.component';
import { ProductStarRatingComponent } from './event-star-rating/event-star-rating.component';
import {TopContributorsComponent} from './top-contributors/top-contributors.component';
import { NgAisModule } from 'angular-instantsearch';
import { EventHomeComponent } from './event-home/event-home.component';
import { HostBillingComponent } from './host-billing/host-billing.component';

@NgModule({
  declarations: [ EventDetailsComponent, EventListComponent, 
  EventsByTypeListComponent,
  ArticleCommentsComponent, TopContributorsComponent,
  BookingEventComponent,ProductStarRatingComponent, 
  EventHomeComponent,HostBillingComponent],
  imports: [
    CommonModule,
    EventHostingRoutingModule,
    CloudinaryModule.forRoot({ Cloudinary }, { cloud_name: 'mytrendingstories' } as CloudinaryConfiguration),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } }),
    QuillModule.forRoot(),
    NgAisModule.forRoot(),
  ]
})
export class EventHostingModule { }
