

import { Component } from '@angular/core'

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
    {
      name: 'Asus Zenfone 3 Zoom ZE553KL Dual Sim (4GB, 64GB)',
      quantity: 2,
      price: 450
    },
    {
      name: 'HP Pavilion 15-au103TX 15.6˝ Laptop Red',
      quantity: 1,
      price: 550
    },
    {
      name: 'Canon EOS 77D',
      quantity: 1,
      price: 875
    },
  ];

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
  markPaid() {
    this.markPaidStatus = true;
  }
}    