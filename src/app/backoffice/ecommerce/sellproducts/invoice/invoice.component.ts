import { Component } from '@angular/core'
import { UserService } from 'src/app/shared/services/user.service';
import { StoreSetting } from 'src/app/backoffice/shared/services/store-setting.service';
import { Store } from 'src/app/shared/interfaces/ecommerce/store';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  templateUrl: './invoice.component.html'
})

export class InvoiceComponent {
  isVisible = false;
  isConfirmLoading = false;
  markPaidStatus = false;
  shippingCarrier: '';
  trackingNumber: '';

  itemData = [

  ];
  currentUser;
  storeDetails;
  isDataLoading = true;
  orderDetails;

  constructor(private userService: UserService, private storeService: StoreSetting, private activatedRoute: ActivatedRoute, private location: Location) {
    this.userService.getCurrentUser().then((user) => {
      this.currentUser = user;
      this.storeService.getStoreById(user.uid).subscribe((storeDetails: Store) => {
        this.storeDetails = storeDetails ? storeDetails[0] : null;;
        if (!this.storeDetails)
          this.goBack();
        this.activatedRoute.queryParams.subscribe(params => {
          let orderId = params['invoice'];
          if (!orderId)
            this.goBack();
          this.storeService.getStoreOrderDetails(this.storeDetails.id, orderId).subscribe((data) => {
            if (!data)
              this.goBack();
            this.orderDetails = data;
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
      setTimeout(() => {
        this.isVisible = false;
        this.isConfirmLoading = false;
      }, 3000);
    }

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
}    