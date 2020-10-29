import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalService } from "ng-zorro-antd";
import { StripeService, StripeCardNumberComponent } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { TranslateService } from "@ngx-translate/core";
import { CountriesConstant } from 'src/app/shared/constants/countries';
import { CartService } from 'src/app/shared/services/shop/cart.service';
import { Product } from 'src/app/shared/interfaces/ecommerce/product';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { CartCalculatorComponent } from '../cart/cart-calculator/cart-calculator.component';

@Component({
  selector: 'app-product-checkout',
  templateUrl: './product-checkout.component.html',
  styleUrls: ['./product-checkout.component.scss']
})
export class ProductCheckoutComponent implements OnInit, OnDestroy {
  loginStatusStep = 0;
  deliveryAddressStep = 1;
  shippingPicker = 2
  paymentOptionsStep = 3;
  orderStatusStep = 4;


  current = this.loginStatusStep;
  isLoggedInUser: boolean;

  // order summary
  products: Product[];
  config = {
    isCheckout: true
  }

  // step1
  userAddressForm: FormGroup;
  buyer;

  // step2
  cardHolderName: string;
  shipppingOptions;
  showInvalidCardError: boolean = false;
  isPlacingOrder: boolean = false;

  countries = CountriesConstant.Countries;


  selectedShippingData = {

  }
  groupedProducts;


  @ViewChild(StripeCardNumberComponent) card: StripeCardNumberComponent;
  @ViewChild(CartCalculatorComponent) cartCalculator: CartCalculatorComponent;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private cartService: CartService,
    private modalService: NzModalService,
    private stripeService: StripeService,
    public translate: TranslateService,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {

    this.authService.getAuthState().subscribe(user => {
      if (user && !user.isAnonymous) {
        this.isLoggedInUser = true;
        this.current = this.deliveryAddressStep;
      } else {
        this.isLoggedInUser = false;
        this.current = this.loginStatusStep;
      }
    });

    this.userAddressForm = this.fb.group({
      name: ['', [Validators.required]],
      mobile_number: ['', [Validators.required]],
      alternate_mobile_number: [null],
      address_line: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postal_code: ['', [Validators.required]],
      country_code: ['', [Validators.required]]
    });

    this.getCartProduct();
    this.groupedProducts = this.getGroupedProducts();

    const body = document.getElementsByTagName('body')[0];
    body.classList.add('remove-header-footer');


  }
  ngOnDestroy() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('remove-header-footer');
  }
  pre(): void {
    if (this.current == this.paymentOptionsStep) {
      this.getShippingData();
    }
    this.current -= 1;

  }

  next(): void {
    if (this.current == this.deliveryAddressStep) {

      for (const i in this.userAddressForm.controls) {
        this.userAddressForm.controls[i].markAsDirty();
        this.userAddressForm.controls[i].updateValueAndValidity();
      }

      if (this.findInvalidControls().length == 0) {
        this.buyer = this.userAddressForm.value;
        this.getShippingData();
        this.current += 1;

      }
    } else if (this.current == this.shippingPicker) {
      let missingShippingInfoData = this.checkShippingInfoPickedOrNot();
      if (missingShippingInfoData) {
        this.missingShippingInfo(missingShippingInfoData)
      } else {
        this.current += 1;
      }

    } else {
      this.current += 1;
    }
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.userAddressForm.controls;

    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    return invalid;
  }

  /*
  * cart related functions ends here
  */

  removeCartProduct(product: Product) {
    this.cartService.removeLocalCartProduct(product);

    // Recalling
    this.getCartProduct();
  }

  getCartProduct() {
    this.products = this.cartService.getLocalCartProducts();
  }

  /*
  * cart related functions ends here
  */

  /*
  * place order related functions starts here
  */

  placeOrder() {
    const cardElement: any = this.card.element;
    this.removeUnwantedDataFromProductColl();
    if (this.cardHolderName && !cardElement._empty && !cardElement._invalid) {
      try {
        this.isPlacingOrder = true;

        const name = this.cardHolderName;

        this.stripeService.createToken(cardElement, { name }).subscribe((result) => {
          if (result.token) {
            let orderData = {};
            orderData['shippingInfo'] = this.buyer;
            orderData['orders'] = this.createOrderData();
            orderData['cardToken'] = result.token.id;

            this.cartService.placeOrder(orderData).then(result => {
              this.userAddressForm.reset();
              this.card.element.clear();
              this.cartService.clearCart();
              this.isPlacingOrder = false;
              this.current += 1;
            }).catch(err => {
              this.isPlacingOrder = false;
              this.showError("PlaceOrderError");
            });
          } else if (result.error) {
            this.isPlacingOrder = false;
            this.showInvalidCardErr();
          }
        });
      } catch (err) {
        this.isPlacingOrder = false;
      }
    } else {
      this.showInvalidCardErr();
    }
  }

  missingShippingInfo(products): void {
    this.modal.info({
      nzTitle: 'Shipping Information Missing',
      nzContent: '<p>Please select shipping for ' + products + ' product(s) to proceed further.</p>'

    });
  }

  showInvalidCardErr() {
    this.showInvalidCardError = true;

    setTimeout(() => {
      this.showInvalidCardError = false;
    }, 3000);
  }

  showError(errorMessage) {
    const msg = this.translate.instant(errorMessage);
    this.modalService.error({
      nzTitle: "<i>" + msg + "</i>",
    });
  }

  getShippingData() {
    for (const key in this.groupedProducts) {
      const products = this.groupedProducts[key];
      const totalWaight = this.getTotalWeight(products);
      if (this.buyer.postal_code) {
        this.shipppingOptions = {};
        this.shipppingOptions[key] = {
          loading: true
        }
        this.cartService.getShippingCarrier(key, { country_code: this.buyer.country_code, postal_code: this.buyer.postal_code, weight: totalWaight }).subscribe((data: any) => {
          //product['shippingInfo'] = data;
          this.shipppingOptions[key] = data;
        })
      }

    }


  }
  setShippingOptionAndPrice(storeId, carrier_id, shippingPrice) {
    this.selectedShippingData[storeId] = {};
    this.selectedShippingData[storeId]['shipping_price'] = shippingPrice;
    this.selectedShippingData[storeId]['carrier_id'] = carrier_id
    this.cartCalculator.updatePriceData(this.selectedShippingData);
  }
  checkShippingInfoPickedOrNot() {
    let missingShipingCarrierProductName = '';
    this.products.forEach((product) => {
      if (!this.selectedShippingData[product.storeId])
        if (!missingShipingCarrierProductName) {
          missingShipingCarrierProductName = product['name'];
        }
        else {
          missingShipingCarrierProductName += ', ' + product['name'];
        }

    })
    return missingShipingCarrierProductName;
  }
  removeUnwantedDataFromProductColl() {
    for (let index = 0; index < this.products.length; index++) {
      delete this.products[index]['shipping_price']
      delete this.products[index]['shippingInfo']

    }
  }
  getGroupedProducts() {
    return this.products.reduce((r, a) => {
      r[a.storeId] = [...r[a.storeId] || [], a];
      return r;
    }, {});
  }
  getTotalWeight(products) {
    let totalWaightOfThisGroup = 0;
    for (let index = 0; index < products.length; index++) {
      const product = products[index];
      totalWaightOfThisGroup += parseFloat(product.weight ? product.weight : 0);

    }
    return totalWaightOfThisGroup;

  }

  createOrderData() {
    let orderList = [];
    for (const key in this.selectedShippingData) {
      var orderData = {};
      const shippingDetails = this.selectedShippingData[key];
      orderData['storeId'] = key;
      orderData['products'] = this.groupedProducts[key];
      orderData['carrier_id'] = shippingDetails['carrier_id'];

      orderList.push(orderData);

    }

    return orderList;
  }
  /*
  * place order related functions ends here
  */

}
