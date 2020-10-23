import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
  OnDestroy,
  Output,
  EventEmitter
} from "@angular/core";
import { Product } from "src/app/shared/interfaces/ecommerce/product";
import { TranslateService } from '@ngx-translate/core';
import { CartService } from "src/app/shared/services/shop/cart.service";

@Component({
  selector: 'app-cart-calculator',
  templateUrl: './cart-calculator.component.html',
  styleUrls: ['./cart-calculator.component.scss']
})
export class CartCalculatorComponent implements OnInit, OnChanges, OnDestroy {

  @Input() products: Product[];

  @Input() config: {
    isCheckout: boolean;
  }
  @Input() currentStep;

  @Input() shippingInfo;

  @Output() selectedShippingOptionEvent = new EventEmitter<string>();

  shipppingOptions: any = [];
  totalValue = 0;
  totalWithShipping = 0;
  currentStepData = 0;
  shippingInfoData;
  weight;

  constructor(
    public translate: TranslateService,
    private cartService: CartService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.products) {
      const dataChanges: SimpleChange = changes.products;
      const products: Product[] = dataChanges.currentValue;
      this.totalValue = 0;
      products.forEach((product) => {
        if (product.discountedPrice) {
          this.totalValue += product.discountedPrice;
        } else {
          this.totalValue += product.salePrice;

        }
        this.weight += product.weight ? parseFloat(product.weight) : 0;
      });
      this.totalWithShipping = this.totalValue;

    }
    if (changes.currentStep) {
      const currentStepChanges: SimpleChange = changes.currentStep;
      this.currentStepData = currentStepChanges.currentValue;

    }
    if (changes.shippingInfo) {
      const currentStepChanges: SimpleChange = changes.shippingInfo;
      this.shippingInfoData = currentStepChanges.currentValue;

    }
    this.getShippingData();





  }

  ngOnInit() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('hide-modal-footer');
  }

  ngOnDestroy() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('hide-modal-footer');
  }
  shippingStationChanged(shipper) {
    this.totalWithShipping = this.totalValue + parseFloat(shipper?.shipping_amount?.amount);
    this.selectedShippingOptionEvent.emit(shipper.carrier_id);
  }
  getShippingData() {
    if (this.currentStepData == 2 && this.shippingInfoData && this.shippingInfoData.postal_code && this.shippingInfoData.country_code) {
      this.shipppingOptions = [{
        "rate_type": "check",
        "carrier_id": "se-3847014",
        "shipping_amount": {
          "currency": "usd",
          "amount": 11.3800
        },
        "insurance_amount": {
          "currency": "usd",
          "amount": 0.0
        },
        "confirmation_amount": {
          "currency": "usd",
          "amount": 0.0
        },
        "other_amount": {
          "currency": "usd",
          "amount": 0.0
        },
        "zone": 6,
        "package_type": "package",
        "delivery_days": 6,
        "guaranteed_service": false,
        "estimated_delivery_date": "2020-10-30T00:00:00Z",
        "carrier_delivery_days": "6",
        "ship_date": "2020-10-23T00:00:00Z",
        "negotiated_rate": false,
        "service_type": "USPS Media Mail",
        "service_code": "usps_media_mail",
        "trackable": true,
        "carrier_code": "stamps_com",
        "carrier_nickname": "ShipEngine Test Account - Stamps.com",
        "carrier_friendly_name": "Stamps.com",
        "validation_status": "unknown",
        "warning_messages": [],
        "error_messages": []
      }, {
        "rate_type": "check",
        "carrier_id": "se-384701",
        "shipping_amount": {
          "currency": "usd",
          "amount": 11.3800
        },
        "insurance_amount": {
          "currency": "usd",
          "amount": 0.0
        },
        "confirmation_amount": {
          "currency": "usd",
          "amount": 0.0
        },
        "other_amount": {
          "currency": "usd",
          "amount": 0.0
        },
        "zone": 6,
        "package_type": "package",
        "delivery_days": 6,
        "guaranteed_service": false,
        "estimated_delivery_date": "2020-10-30T00:00:00Z",
        "carrier_delivery_days": "6",
        "ship_date": "2020-10-23T00:00:00Z",
        "negotiated_rate": false,
        "service_type": "USPS Media Mail 2",
        "service_code": "usps_media_mail",
        "trackable": true,
        "carrier_code": "stamps_com",
        "carrier_nickname": "ShipEngine Test Account - Stamps.com",
        "carrier_friendly_name": "Stamps.com",
        "validation_status": "unknown",
        "warning_messages": [],
        "error_messages": []
      }];
      this.cartService.getShippingCarrier({ country_code: this.shippingInfoData.country_code, postal_code: this.shippingInfoData.postal_code, weight: this.weight }).subscribe((data) => {
        this.shipppingOptions = data;
      });
    }
  }

}
