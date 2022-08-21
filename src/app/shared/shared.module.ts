import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { ThemeConstantService } from "./services/theme-constant.service";
import { SearchPipe } from "./pipes/search.pipe";
import { StripTagsPipe } from "./pipes/striptags.pipe";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { ImgSizePipe } from "./pipes/img-size.pipe";
import { ArticleInteractionComponent } from "./component/article-interaction/article-interaction.component";
import { ArticleAvatarComponent } from "./component/article-avatar/article-avatar.component";
import { CloudinaryImgComponent } from "./component/cloudinary-img/cloudinary-img.component";
import {
  CloudinaryModule,
  CloudinaryConfiguration,
} from "@cloudinary/angular-5.x";
import { Cloudinary } from "cloudinary-core";
import { ShareButtonsComponent } from "./component/share-buttons/share-buttons.component";
import { AdDirective } from "./directives/ad/ad.directive";
import { SeoService } from "./services/seo/seo.service";
import { QuicklinkModule } from "ngx-quicklink";
import { CharityDonateFormComponent } from "./component/charity-donate-form/charity-donate-form.component";
import { CompanyLeadFormComponent } from "./component/company-lead-form/company-lead-form.component";
import { FundraiserDonateFormComponent } from "./component/fundraiser-donate-form/fundraiser-donate-form.component";

import { NgxStripeModule } from "ngx-stripe";
import { environment } from "src/environments/environment";
import { CloudinaryFeatureImgComponent } from "./component/cloudinary-feature-img/cloudinary-feature-img.component";
import { FluidToolbarComponent } from "./component/fluid-toolbar/fluid-toolbar.component";
import { ShareButtonsDialogComponent } from './component/share-buttons-dialog/share-buttons-dialog.component';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { SanitizedHtmlPipe } from "./pipes/sanitized-html.pipe";

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
  ],
  providers: [
    ThemeConstantService,
    SeoService,
  ]
})
export class SharedModule {}
