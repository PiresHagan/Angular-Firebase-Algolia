import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Product } from 'src/app/shared/interfaces/ecommerce/product';
import { CartService } from 'src/app/shared/services/shop/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cartProducts: Product[];
  showDataNotFound = true;
  config: {
    isCheckout: false;
  }

  // Not Found Message
  messageTitle = "No Products Found in Cart";
  messageDescription = "Please, Add Products to Cart";

  constructor(
    private cartService: CartService,
    private location: Location
  ) {}

  ngOnInit() {
    this.getCartProduct();
  }

  removeCartProduct(product: Product) {
    this.cartService.removeLocalCartProduct(product);

    // Recalling
    this.getCartProduct();
  }

  getCartProduct() {
    this.cartProducts = this.cartService.getLocalCartProducts();
  }

  goBack() {
    this.location.back();
  }

}
