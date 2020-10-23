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

@Component({
  selector: 'app-product-checkout',
  templateUrl: './product-checkout.component.html',
  styleUrls: ['./product-checkout.component.scss']
})
export class ProductCheckoutComponent implements OnInit, OnDestroy {
  loginStatusStep = 0;
  deliveryAddressStep = 1;
  paymentOptionsStep = 2;
  orderStatusStep = 3;

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

  selectedShippingOption: string = "";
  countries = CountriesConstant.Countries;


  @ViewChild(StripeCardNumberComponent) card: StripeCardNumberComponent;

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
      name: [null, [Validators.required]],
      mobile_number: [null, [Validators.required]],
      alternate_mobile_number: [null],
      address: [null, [Validators.required]],
      city: [null, [Validators.required]],
      state: [null, [Validators.required]],
      postal_code: [null, [Validators.required]],
      country_code: [null, [Validators.required]]
    });

    this.getCartProduct();
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('remove-header-footer');


  }
  ngOnDestroy() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('remove-header-footer');
  }
  pre(): void {
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
    if (!this.selectedShippingOption) {
      this.info();
      return;
    }
    if (this.cardHolderName && !cardElement._empty && !cardElement._invalid) {
      try {
        this.isPlacingOrder = true;

        const name = this.cardHolderName;

        this.stripeService.createToken(cardElement, { name }).subscribe((result) => {
          if (result.token) {
            let orderData = {};


            this.buyer['carrier_id'] = this.selectedShippingOption;
            orderData['shippingInfo'] = this.buyer;
            orderData['products'] = this.products;
            orderData['cardToken'] = result.token.id;
            // orderData['carrier_id'] = this.selectedShippingOption;
            //   orderData['country_code'] = 'US';


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

  info(): void {
    this.modal.info({
      nzTitle: 'Shipping Information Missing',
      nzContent: '<p>Please select shipping information to proceed further.</p>'

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
  onShipOptionSelected(shipperId: string) {
    this.selectedShippingOption = shipperId;
  }

  /*
  * place order related functions ends here
  */

}
