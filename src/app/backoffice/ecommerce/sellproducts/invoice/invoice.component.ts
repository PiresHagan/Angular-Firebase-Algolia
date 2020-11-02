import { Component } from '@angular/core'
import { UserService } from 'src/app/shared/services/user.service';
import { StoreSetting } from 'src/app/backoffice/shared/services/store-setting.service';
import { Store } from 'src/app/shared/interfaces/ecommerce/store';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  templateUrl: './invoice.component.html'
})

export class InvoiceComponent {
  isVisible = false;
  isConfirmLoading = false;
  markPaidStatus = false;
  shippingCarrier: '';
  trackingNumber: '';
  shippingSuccess = false;
  shippingError = false;

  itemData = [

  ];
  currentUser;
  storeDetails;
  isDataLoading = true;
  orderDetails;
  orderId = '';


  constructor(private userService: UserService, private storeService: StoreSetting, private activatedRoute: ActivatedRoute, private location: Location, private translate: TranslateService, private modal: NzModalService) {
    this.userService.getCurrentUser().then((user) => {
      this.currentUser = user;
      this.storeService.getStoreById(user.uid).subscribe((storeDetails: Store) => {
        this.storeDetails = storeDetails ? storeDetails[0] : null;;
        if (!this.storeDetails)
          this.goBack();
        this.activatedRoute.queryParams.subscribe(params => {
          let orderId = params['invoice'];

          this.orderId = params['invoice'];
          if (!orderId)
            this.goBack();
          this.storeService.getStoreOrderDetails(this.storeDetails.id, orderId).subscribe((data: any) => {
            if (!data)
              this.goBack();
            this.orderDetails = data;
            this.shippingCarrier = data.shippingCarrier;
            this.trackingNumber = data.trackingNumber;
            this.itemData = this.orderDetails.products;

            this.isDataLoading = false;
            console.log(data);
          }, (error) => {
            this.goBack();
          })

        });

      })
    })


  }

  handleOk(): void {
    if (this.shippingCarrier && this.trackingNumber) {
      this.isConfirmLoading = true;
      this.shippingSuccess = false;
      this.shippingError = false;
      this.storeService.updateTrackingInfo(this.storeDetails.id, this.orderDetails.id, { trackingNumber: this.trackingNumber, shippingCarrier: this.shippingCarrier }).subscribe(() => {
        this.shippingSuccess = true;
        this.hidePopup()

      }, error => {
        this.shippingError = true;
        this.hidePopup()
      })

    }

  }
  hidePopup() {
    setTimeout(() => {
      this.shippingSuccess = false;
      this.shippingError = false;
      this.isVisible = false;
      this.isConfirmLoading = false;
    }, 1000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  markFullfill(): void {
    this.isVisible = true;
  }
  goBack() {
    this.location.back();
  }
  getPrice(item) {
    if (item.discountedPrice)
      return parseInt(item.discountedPrice) * parseInt(item.quantity);
    else
      return parseInt(item.salePrice) * parseInt(item.quantity);
  }
  getSinglePrice(item) {
    if (item.discountedPrice)
      return parseInt(item.discountedPrice)
    else
      return parseInt(item.salePrice)
  }
  checkOrderStatus() {
    this.storeService.getTrackingInfo(this.orderId).subscribe((trackingData) => {
      console.log(trackingData);
      let message = this.translate.instant('InOnTheWay')
      if (trackingData && trackingData['status_code'] == "NY") {
        message = this.translate.instant('InTransit');
      } else if (trackingData && trackingData['status_code'] == "AC") {
        message = this.translate.instant('InOnTheWay');
      } else if (trackingData && trackingData['status_code'] == "IT") {
        message = this.translate.instant('InOnTheWay');
      } else if (trackingData && trackingData['status_code'] == "DE") {
        message = this.translate.instant('InDelivery');
      } else if (trackingData && trackingData['status_code'] == "EX") {
        message = this.translate.instant('InException');
      } else if (trackingData && trackingData['status_code'] == "UN") {
        message = this.translate.instant('InOnTheWay');
      } else if (trackingData && trackingData['status_code'] == "AT") {
        message = this.translate.instant('DeleveryAttemped');
      }
      const modal = this.modal.create({
        nzTitle: this.translate.instant('ShippingInfo'),
        nzContent: message
      })
    }, () => {
      const modal = this.modal.create({
        nzTitle: this.translate.instant('CampERROR'),
        nzContent: this.translate.instant('somethingWrongErr')
      })

    })
  }
}    