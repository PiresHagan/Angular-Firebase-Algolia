
import { Component, ViewContainerRef } from '@angular/core'
import { UserService } from 'src/app/shared/services/user.service';
import { StoreSetting } from 'src/app/backoffice/shared/services/store-setting.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ShopProductAddReviewComponent } from 'src/app/shared/component/shop-product-add-review/shop-product-add-review.component';
import { NzModalService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})

export class OrderDetailsComponent {
  isVisible = false;
  isConfirmLoading = false;
  markPaidStatus = false;
  shippingCarrier: '';
  trackingNumber: '';
  orderId = '';

  itemData = [

  ];
  currentUser;
  storeDetails;
  isDataLoading = true;
  orderDetails;

  constructor(private userService: UserService,
    private storeService: StoreSetting,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private modal: NzModalService, private viewContainerRef: ViewContainerRef,
    private translate: TranslateService

  ) {
    this.userService.getCurrentUser().then((user) => {
      this.currentUser = user;
      this.activatedRoute.queryParams.subscribe(params => {
        let orderId = params['invoice'];
        this.orderId = params['invoice'];
        if (!orderId)
          this.goBack();
        this.storeService.getCustomerOrderDetails(orderId).subscribe((data) => {
          if (!data)
            this.goBack();
          this.orderDetails = data;
          this.itemData = this.orderDetails.products;

          this.isDataLoading = false;
          // console.log(data);
        }, (error) => {
          this.goBack();
        })

      });
    })


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
      // console.log(trackingData);
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
  addReview(product): void {
    const modal = this.modal.create({
      nzTitle: 'Add Review',
      nzContent: ShopProductAddReviewComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        product: product
      },
      nzOnOk: () => new Promise(resolve => setTimeout(resolve, 1000)),
      nzFooter: [
        {
          label: 'Save Review',
          onClick: componentInstance => {
            instance.checkReviewForm();
            modal.destroy();
          }
        }
      ]
    });
    const instance = modal.getContentComponent();
    instance.getuserProductReview();
    // modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    // // Return a result when closed
    // modal.afterClose.subscribe(result => console.log('[afterClose] The result is:', result));

    // delay until modal instance created
    // setTimeout(() => {
    //   instance.subtitle = 'sub title is changed';
    // }, 2000);
  }
  getCalculatedShipping(orderDetails) {
    return parseFloat(orderDetails.totalPrice) + orderDetails?.shippingRate?.shipping_amount?.amount;
  }
}    