import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalService } from "ng-zorro-antd";
import { StripeService, StripeCardNumberComponent } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { TranslateService } from "@ngx-translate/core";

import { CartService } from 'src/app/shared/services/shop/cart.service';
import { Product } from 'src/app/shared/interfaces/ecommerce/product';
import { AuthService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-product-checkout',
  templateUrl: './product-checkout.component.html',
  styleUrls: ['./product-checkout.component.scss']
})
export class ProductCheckoutComponent implements OnInit {
  current = 0;
  isLoggedInUser: boolean;
  
  // step1
  userAddressForm: FormGroup;
  buyer;

  // step2
  products: Product[];
  config = {
    isCheckout: true
  }

  // step3
  cardHolderName: string;
  showInvalidCardError: boolean = false;
  isPlacingOrder: boolean = false;

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
  ) { }

  ngOnInit(): void {

    this.authService.getAuthState().subscribe(user => {
      if (user && !user.isAnonymous) {
        this.isLoggedInUser = true;
      } else {
        this.isLoggedInUser = false;
      }
    });

    this.userAddressForm = this.fb.group({
      name: [null, [Validators.required]],
      mobile_number: [null, [Validators.required]],
      area_code: [null, [Validators.required]],
      locality: [null, [Validators.required]],
      address: [null, [Validators.required]],
      city: [null, [Validators.required]],
      state: [null, [Validators.required]],
      landmark: [null, [Validators.required]],
      alternate_mobile_number: [null]
    });

    this.getCartProduct();
  }

  pre(): void {
    this.current -= 1;
  }

  next(): void {
    if(this.current == 0) {
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

  done(): void {
    console.log('done'); 
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
    if (this.cardHolderName && !cardElement._empty && !cardElement._invalid) {
      try {
        this.isPlacingOrder = true;

        const name = this.cardHolderName;

        this.stripeService.createToken(cardElement, { name }).subscribe((result) => {
          if (result.token) {
            let orderData = {};
            orderData['buyer'] = this.buyer;
            orderData['products'] = this.products;
            orderData['card_token'] = result.token.id;

            this.cartService.placeOrder(orderData).then(result => {
              this.userAddressForm.reset();
              this.card.element.clear();
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

  showInvalidCardErr() {
    this.showInvalidCardError = true;

    setTimeout(()=> {
      this.showInvalidCardError = false;
    }, 3000);
  }

  showError(errorMessage) {
    const msg = this.translate.instant(errorMessage);
    this.modalService.error({
      nzTitle: "<i>" + msg + "</i>",
    });
  }

  /*
  * place order related functions ends here
  */

}
