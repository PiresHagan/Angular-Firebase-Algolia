import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CampaignService } from 'src/app/backoffice/shared/services/campaign.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { TOPPOSTCAMPAIGN } from 'src/app/shared/constants/campaign-constants';
import { BackofficeArticleService } from 'src/app/backoffice/shared/services/backoffice-article.service';
import { ACTIVE } from 'src/app/shared/constants/status-constants';
import { UserService } from 'src/app/shared/services/user.service';
import { UpdateBillingComponent } from '../../update-billing/update-billing.component';

@Component({
  selector: 'app-checkout-post-campaign',
  templateUrl: './checkout-post-campaign.component.html',
  styleUrls: ['./checkout-post-campaign.component.css']
})
export class CheckoutPostCampaignComponent implements OnInit {

  @ViewChild(UpdateBillingComponent) paymentDetails: UpdateBillingComponent;
  checkoutCampaign: FormGroup;
  isFormSaving: boolean = false;
  price;
  campaignData;
  loading;
  articleData;
  campaignId: string;
  constructor(private fb: FormBuilder,
    private modal: NzModalService,
    private router: Router,
    private campaignService: CampaignService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private userService: UserService,
    private backofficeArticleService: BackofficeArticleService) {

    this.checkoutCampaign = this.fb.group({
      campaignInfo: [''],
      // campaignBillingInfo: ['', [Validators.required]]
    });

  }

  ngOnInit(): void {
    this.campaignService.getProductPrice(TOPPOSTCAMPAIGN).subscribe((data: any) => {
      this.price = data[0].price;
    })
    this.campaignId = this.route.snapshot.params['campaignId'];
    this.campaignService.getCampaignInfo(this.campaignId).subscribe((data: any) => {
      console.log(data);
      this.campaignData = data;
      this.loadArticleData(data.articleId);
    }, error => {

      this.router.navigate(['app/campaign/campaign-manager']);
    })

  }
  submitForm(values) {
    this.isFormSaving = true;
    const campaignId = this.route.snapshot.params['campaignId'];
    this.campaignService.checkoutCampaign(campaignId, { campaignInfo: values.campaignInfo }).subscribe((data: any) => {
      this.isFormSaving = false;
      let $paymentMessage = this.translate.instant("CampPaymentMessage");
      let $paymentHeading = this.translate.instant("CampPaymentSuccessful");
      let $OkBtn = this.translate.instant("CampGoToCampaign");
      let $transactionAmount = this.translate.instant("CampTransactionAmount");
      let $transactionId = this.translate.instant("CampTransactionId");
      this.modal.success({
        nzTitle: $paymentHeading,
        nzContent: `<p>${$paymentMessage}</p><br><p>${$transactionId} ${data.invoiceId}</p><br><p>${$transactionAmount} ${data.amount}</p>`,
        nzOnOk: () => {
          this.router.navigate(['app/campaign/campaign-manager']);
        }

      });

    }, (error) => {

      this.isFormSaving = false;
      let $errorLbl = this.translate.instant("CampERROR");
      let $OkBtn = this.translate.instant("CampOK");
      this.modal.error({
        nzTitle: $errorLbl,
        nzContent: '<p>' + error && error.error.message ? error.error.message : error.message + '</p>',
        nzOnOk: () => $OkBtn
      });
    })
  }
  loadArticleData(articleId: string) {
    this.userService.getCurrentUser().then((user) => {


      this.backofficeArticleService.getArticleById(articleId, user.uid, ACTIVE).then((data) => {
        this.articleData = data
        console.log(data);
      })

    })

  }



}


