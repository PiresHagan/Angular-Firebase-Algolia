import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CartService } from 'src/app/shared/services/shop/cart.service';
import { Product } from 'src/app/shared/interfaces/ecommerce/product';

@Component({
  selector: 'app-product-checkout',
  templateUrl: './product-checkout.component.html',
  styleUrls: ['./product-checkout.component.scss']
})
export class ProductCheckoutComponent implements OnInit {
  current = 0;
  userAddressForm: FormGroup;
  buyer;
  products: Product[];

  constructor(
    private fb: FormBuilder,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
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
        console.log(this.buyer);
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

}
