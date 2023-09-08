import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { RouterModule } from "@angular/router";
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ArticleInteractionComponent } from './component/article-interaction/article-interaction.component';
import { ArticleAvatarComponent } from './component/article-avatar/article-avatar.component';
import { CloudinaryImgComponent } from './component/cloudinary-img/cloudinary-img.component';
import { ShareButtonsComponent } from './component/share-buttons/share-buttons.component';
import { ImgSizePipe } from './pipes/img-size.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { ShopProductAddReviewComponent } from './component/shop-product-add-review/shop-product-add-review.component';
import { ShopProductCardComponent } from './component/shop-product-card/shop-product-card.component';
import { StoreComponent } from './component/store/store.component';
import { StripTagsPipe } from './pipes/striptags.pipe';
import { ThemeConstantService } from './services/theme-constant.service';
import { ProductStarRatingComponent } from './component/product-star-rating/product-star-rating.component';
import { AdDirective } from './directives/ad/ad.directive';
import { SeoService } from './services/seo/seo.service';
import { QuicklinkModule } from 'ngx-quicklink';
import { CharityDonateFormComponent } from './component/charity-donate-form/charity-donate-form.component';
import { CompanyLeadFormComponent } from './component/company-lead-form/company-lead-form.component';
import { FundraiserDonateFormComponent } from './component/fundraiser-donate-form/fundraiser-donate-form.component';

import { NgxStripeModule } from "ngx-stripe";
import { environment } from "src/environments/environment";
import { CloudinaryFeatureImgComponent } from "./component/cloudinary-feature-img/cloudinary-feature-img.component";
import { FluidToolbarComponent } from "./component/fluid-toolbar/fluid-toolbar.component";
import { ShareButtonsDialogComponent } from './component/share-buttons-dialog/share-buttons-dialog.component';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { SanitizedHtmlPipe } from "./pipes/sanitized-html.pipe";
import { ServiceContactFormComponent } from './component/service-contact-form/service-contact-form.component';
import { PoliticianContactFormComponent } from './component/politician-contact-form/politician-contact-form.component';
import { HairSalonLeadFormComponent} from './component/hair-salon-lead-form/hair-salon-lead-form.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  exports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    PerfectScrollbarModule,
    SearchPipe,
    ArticleInteractionComponent,
    ArticleAvatarComponent,
    CloudinaryImgComponent,
    ShareButtonsComponent,
    AdDirective,
    QuicklinkModule,
    CharityDonateFormComponent,
    CompanyLeadFormComponent,
    FundraiserDonateFormComponent,
    CloudinaryFeatureImgComponent,
    FluidToolbarComponent,
    ShareButtonsDialogComponent,
    SanitizedHtmlPipe,
    ShopProductAddReviewComponent,
    ShopProductCardComponent,
    StoreComponent,
    ProductStarRatingComponent,
    ServiceContactFormComponent,
    PoliticianContactFormComponent,
    HairSalonLeadFormComponent
  ],
  imports: [
    ShareButtonsModule,
    ShareIconsModule,
    RouterModule,
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    QuicklinkModule,
    CloudinaryModule.forRoot({ Cloudinary }, { cloud_name: 'mytrendingstories' } as CloudinaryConfiguration),
    NgxStripeModule.forRoot(environment.stripePublishableKey),
    TranslateModule.forChild({
        useDefaultLang: true,
        isolate: false,
        loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient]
        }
    }),
  ],
  declarations: [
    SearchPipe,
    StripTagsPipe,
    ImgSizePipe,
    ArticleInteractionComponent,
    ArticleAvatarComponent,
    CloudinaryImgComponent,
    ShareButtonsComponent,
    AdDirective,
    CharityDonateFormComponent,
    CompanyLeadFormComponent,
    FundraiserDonateFormComponent,
    CloudinaryFeatureImgComponent,
    FluidToolbarComponent,
    ShareButtonsDialogComponent,
    SanitizedHtmlPipe,
    ShopProductAddReviewComponent,
    ShopProductCardComponent,
    StoreComponent,
    ProductStarRatingComponent,
    ServiceContactFormComponent,
    PoliticianContactFormComponent,
    HairSalonLeadFormComponent
  ],
  providers: [
    ThemeConstantService,
    SeoService,
  ]
})
export class SharedModule {}
