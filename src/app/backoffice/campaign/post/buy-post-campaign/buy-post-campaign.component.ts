import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Article } from 'src/app/shared/interfaces/article.type';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { BackofficeArticleService } from 'src/app/backoffice/shared/services/backoffice-article.service';
import { CampaignService } from 'src/app/backoffice/shared/services/campaign.service';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { TOPPOSTCAMPAIGN } from 'src/app/shared/constants/campaign-constants';

@Component({
  selector: 'app-buy-post-campaign',
  templateUrl: './buy-post-campaign.component.html',
  styleUrls: ['./buy-post-campaign.component.css']
})
export class BuyPostCampaignComponent implements OnInit {
  loading: boolean = false;
  isFormSaving: boolean = false;
  postCampaignForm: FormGroup
  articleList: Article[];;
  userDetails;
  price;
  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private modal: NzModalService, private articleService: BackofficeArticleService, public authService: AuthService, private campaignService: CampaignService, private router: Router) {

    this.postCampaignForm = this.fb.group({
      article: ['', [Validators.required]],
      campaignDate: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {

    this.campaignService.getProductPrice(TOPPOSTCAMPAIGN).subscribe((data: any) => {
      this.price = data[0].price;
    })

    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;
      this.userDetails = await this.authService.getLoggedInUserDetails();
      if (this.userDetails) {
        this.articleService.getAllArticles(this.userDetails.id).subscribe((data) => {
          this.articleList = data;
          this.loading = false;
        });

      }

    })
  }
  submitForm(value): void {

    for (const key in this.postCampaignForm.controls) {
      this.postCampaignForm.controls[key].markAsDirty();
      this.postCampaignForm.controls[key].updateValueAndValidity();
    }
    const formDetails = {
      articleId: value.article,
      campaignDate: value.campaignDate.toISOString()
    }
    this.buySponsoredPost(formDetails)
  }
  buySponsoredPost(formDetails) {
    this.isFormSaving = true;
    this.campaignService.buySponsoredPost(formDetails).subscribe((response: any) => {
      this.isFormSaving = false;
      this.router.navigate(['app/campaign/sponsored-post/checkout-sponsored-post', response.invoiceId]);
    }, (error) => {
      this.isFormSaving = false;
      let $errorLbl = this.translate.instant("CampERROR");
      let $OkBtn = this.translate.instant("CampOK");
      this.modal.error({
        nzTitle: $errorLbl,
        nzContent: '<p>' + error ? error.message : error.message + '</p>',
        nzOnOk: () => $OkBtn
      });


    })
  }

}
