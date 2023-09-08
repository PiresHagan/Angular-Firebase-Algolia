import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { createTranslateLoader, SharedModule } from 'src/app/shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ReactiveFormsModule } from '@angular/forms';
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';
import { NgAisModule } from 'angular-instantsearch';
import { HairSalonHomeComponent } from './hair-salon-home/hair-salon-home.component';
import { HairSalonRoutingModule } from './hair-salon-routing.module';
import { HairSalonListComponent } from './hair-salon-list/hair-salon-list.component';
import { HairSalonDetailsComponent } from './hair-salon-details/hair-salon-details.component';



@NgModule({
  declarations: [HairSalonHomeComponent, HairSalonListComponent, HairSalonDetailsComponent],
  imports: [
    CloudinaryModule.forRoot({ Cloudinary }, { cloud_name: 'mytrendingstories' } as CloudinaryConfiguration),
    CommonModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    HairSalonRoutingModule,
    SharedModule,
    NgAisModule.forRoot(),
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } }),
  ],
  providers: [
    DatePipe
  ]
})
export class HairSalonModule { }
