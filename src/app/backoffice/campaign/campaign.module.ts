import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignRoutingModule } from './campaign-routing.module';
import { SponsoredPostComponent } from './sponsored-post/sponsored-post.component';
import { NzTabsModule } from 'ng-zorro-antd';



@NgModule({
  declarations: [SponsoredPostComponent],
  imports: [
    CommonModule,
    CampaignRoutingModule,
    NzTabsModule
  ]
})
export class CampaignModule { }
