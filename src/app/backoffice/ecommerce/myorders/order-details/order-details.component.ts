
import { Component } from '@angular/core'
import { UserService } from 'src/app/shared/services/user.service';
import { StoreSetting } from 'src/app/backoffice/shared/services/store-setting.service';
import { Store } from 'src/app/shared/interfaces/ecommerce/store';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  templateUrl: './order-details.component.html'
})

export class OrderDetailsComponent {
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
      this.activatedRoute.queryParams.subscribe(params => {
        let orderId = params['invoice'];
        if (!orderId)
          this.goBack();
        this.storeService.getCustomerOrderDetails(orderId).subscribe((data) => {
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