import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundraiserContentComponent } from './fundraiser-content/fundraiser-content.component';
import { FundraiserImageComponent } from './fundraiser-image/fundraiser-image.component';
import { FundraiserSeoComponent } from './fundraiser-seo/fundraiser-seo.component';
import { FundraiserPublishComponent } from './fundraiser-publish/fundraiser-publish.component';

const routes: Routes = [{
  path: '',
  children: [
    {
      path: '',
      component: FundraiserContentComponent,
      data: {
        title: "Fundraiser Content"
      }
    },
    {
      path: 'image/:fundraiserId',
      component: FundraiserImageComponent,
      data: {
        title: "Fundraiser Image"
      }
    },
    {
      path: 'seo/:fundraiserId',
      component: FundraiserSeoComponent,
      data: {
        title: 'Fundraiser SEO'
      }
    },
    {
      path: 'publish/:fundraiserId',
      component: FundraiserPublishComponent,
      data: {
        title: 'Fundraiser Publish'
      }
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FundraiserAddRoutingModule { }
