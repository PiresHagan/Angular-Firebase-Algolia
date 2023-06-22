import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';
import { createTranslateLoader, SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { GroupsRoutingModule } from './groups-routing.module';
import { AddGroupComponent } from './add-group/add-group.component';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { TopContributorsComponent } from './top-contributors/top-contributors.component';
import {ArticleCommentsComponent} from './group-comments/group-comments.component';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { ProductStarRatingComponent } from './group-star-rating/group-star-rating.component';
import { NgAisModule } from 'angular-instantsearch';
import { GroupBillingComponent } from './group-billing/group-billing.component';
import { GroupPackagesComponent } from './group-packages/group-packages.component';
import { SelectPackageComponent } from './select-package/select-package.component';

@NgModule({
  declarations: [AddGroupComponent, GroupDetailsComponent, GroupsListComponent,TopContributorsComponent,
    ArticleCommentsComponent,ProductStarRatingComponent, GroupBillingComponent, GroupPackagesComponent, SelectPackageComponent],
  imports: [
    CommonModule,
    CloudinaryModule.forRoot({ Cloudinary }, { cloud_name: 'mytrendingstories' } as CloudinaryConfiguration),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } }),
    QuillModule.forRoot(),
    GroupsRoutingModule,
    NzRateModule,
    NgAisModule.forRoot()
  ]
})
export class GroupsModule { }

