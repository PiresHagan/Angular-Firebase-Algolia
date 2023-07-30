import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {Location} from '@angular/common';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer, VC_Message, VC_Participant, VideoConferenceSession } from 'src/app/shared/interfaces/video-conference-session.type';
import {environment} from 'src/environments/environment';
import {AuthService} from 'src/app/shared/services/authentication.service';
import { NzMessageService } from "ng-zorro-antd/message";
import {VideoConferencePackage, VideoConferenceSubscription, VideoConferencePackageCycle} from 'src/app/shared/interfaces/video-conference-session.type';
import { VideoConferenceService } from 'src/app/shared/services/video-conference.service';
import { VideoConferenceConstant } from 'src/app/shared/constants/video-conference-constants';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd';

import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { VideoConferenceBillingComponent } from '../video-conference-billing/video-conference-billing.component';

@Component({
  selector: 'app-buy-backage',
  templateUrl: './buy-backage.component.html',
  styleUrls: ['./buy-backage.component.scss']
})
export class BuyBackageComponent implements OnInit, OnDestroy {
  @ViewChild(VideoConferenceBillingComponent) paymentDetails: VideoConferenceBillingComponent;
  private ngUnsubscribe = new Subject<void>();
  backageplanid:string;
  backageCycleId:string;
  SelectedpackageCycle:VideoConferencePackageCycle;
  backageplanidOrbackageCycleIdNotSelected: boolean = false;
  isLoading: boolean = true;
  ispaymentMethodLoading: boolean = false;
  loggedInUser: any;
  customerId: any;
  videoConferencePackages: VideoConferencePackage[] = [];
  videoConferencePackageCycles:VideoConferencePackageCycle[] = [];
  nzCurrent:number = 0;
  customerCreateForm: FormGroup;
  customerCreateFormValid:boolean=false;
  customerObject:Customer=null;
  isSaveCustomerFormLoading: boolean;
  customerCreated: boolean;
  isUpgradingPlan: boolean = false;
  currentVideoConferenceSubscription: VideoConferenceSubscription;
  paymentDetails_defaultSelectedCard_id: string;
  constructor(private activeRoute: ActivatedRoute,
    private authService:AuthService,
    private VideoConferenceService: VideoConferenceService,
    private fb: FormBuilder,
    public translate: TranslateService,
    public modalService: NzModalService,
    private router: Router,
    private location: Location,
    private message: NzMessageService
    ) { }
  async ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  ngOnInit(): void {
    this.activeRoute.paramMap.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      this.backageplanid = params.get('backageplanid');
    });
    this.authService.getAuthState().pipe(takeUntil(this.ngUnsubscribe)).subscribe(async (user) => {
      if (!user) return;
      this.loggedInUser = await this.authService.getLoggedInUser(user.uid);
      this.customerId=this.loggedInUser?this.loggedInUser.customerId:null;
    });
  }
  loadPackages() {
    this.VideoConferenceService.getPackages().subscribe((data: VideoConferencePackage[])=> {
      this.videoConferencePackages = data.filter(d=>d.price>0);
      }, err => {
    });
  }
  loadPackageCycls() {
    this.VideoConferenceService.getPackage_cycles(this.backageplanid).subscribe((data: VideoConferencePackageCycle[])=> {
      this.videoConferencePackageCycles = data;
      }, err => {
    });
  }
  loadSubscriptions() {
    this.VideoConferenceService.getVideoConferenceSubscription(this.loggedInUser.customerId).subscribe((data) => {
      this.isLoading = false;
      this.currentVideoConferenceSubscription = data[0];
      }, err => {
      this.isLoading = false;
    });
  }
  selectPackagePlan(selectedPackagePalnId){
    this.backageplanid = selectedPackagePalnId;
    this.backageCycleId = null;
    this.SelectedpackageCycle = null;
    this.backageplanidOrbackageCycleIdNotSelected = false;
    this.loadPackageCycls();
  }
  selectPackageCycle(packageCycle){
    this.SelectedpackageCycle = packageCycle;
    this.backageCycleId = packageCycle.id;
  }

  goNextToPaymentPage(){
    if (this.paymentDetails.paymentError) {
      this.message.create('error', 'Please select default payment method');
    }
    else{
      this.paymentDetails_defaultSelectedCard_id = this.paymentDetails.defaultSelectedCard.id
      this.nzCurrent = this.nzCurrent+1;
      this.loadPackages();
      this.loadPackageCycls();
      this.loadSubscriptions();
      this.isLoading=false;
    }
  }
  goNextToPayment(){
    if(this.backageplanid && this.backageCycleId){
      this.backageplanidOrbackageCycleIdNotSelected = false;
      if(this.loggedInUser){
        this.upgradeVideoConferenceSubscription();
      }
    }
    else{
      this.backageplanidOrbackageCycleIdNotSelected = true;
    }
  }
  goBack(){
    this.nzCurrent = this.nzCurrent-1;
  }
  upgradeVideoConferenceSubscription() {
    if (!this.paymentDetails_defaultSelectedCard_id) {
      this.message.create('error', 'Please select default payment method');
    } else {
      this.isUpgradingPlan = true;
      if (this.currentVideoConferenceSubscription) {
        this.VideoConferenceService.updateVideoConferencePackageSubscription(this.loggedInUser.id, this.currentVideoConferenceSubscription.id, {
          external_id: this.SelectedpackageCycle.external_id,
          paymentMethodId: this.paymentDetails_defaultSelectedCard_id,
          package_type: this.SelectedpackageCycle.package_type?this.SelectedpackageCycle.package_type:VideoConferenceConstant.PACKAGE_TYPE,
          packageId: this.SelectedpackageCycle.id
        }).subscribe((data) => {
          this.showSubscriptionResult('success');
          this.isUpgradingPlan = false;
          this.location.back();
        }, err => {
          this.showSubscriptionResult('error', err.message);
          this.isUpgradingPlan = false;
        });

      }
      else{
        this.VideoConferenceService.createVideoConferenceSubscription(this.loggedInUser.id,
           {
          external_id: this.SelectedpackageCycle.external_id,
          paymentMethodId: this.paymentDetails_defaultSelectedCard_id,
          customer_type: VideoConferenceConstant.USER_TYPE,
          package_type: this.SelectedpackageCycle.package_type?this.SelectedpackageCycle.package_type:VideoConferenceConstant.PACKAGE_TYPE,
          packageId: this.SelectedpackageCycle.id
        }).subscribe((data) => {
          this.showSubscriptionResult('success');
          this.isUpgradingPlan = false;
          this.location.back();
        }, err => {
          this.showSubscriptionResult('error', err.message);
          this.isUpgradingPlan = false;
        });

      }
    }
  }

  cancelSubscription() {
    return this.VideoConferenceService.cancelVideoConferencePackageSubscription(this.loggedInUser.id, this.currentVideoConferenceSubscription.id)
  }

  showSubscriptionResult(type, msg?) {
    if (type == 'error') {
      this.modalService.error({
        nzTitle: msg
      })
    } else if (type == 'success') {
      this.modalService.success({
        nzTitle: "Subscription upgraded successfully!"
      })
    }
  }

}
