import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

import { Product } from '../../interfaces/ecommerce/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private message: NzMessageService,
  ) { }

  // Adding new Product to cart db if logged in else localStorage
  addToCart(data: Product): void {

    const a: Product[] = JSON.parse(localStorage.getItem("avct_item")) || [];
    a.push(data);

    setTimeout(() => {
      localStorage.setItem("avct_item", JSON.stringify(a));
      this.message.success(`${data.name} added to cart successfully`);
    }, 1000);
  }

  // Removing cart from local
  removeLocalCartProduct(product: Product) {
    const products: Product[] = JSON.parse(localStorage.getItem("avct_item"));

    for (let i = 0; i < products.length; i++) {
      if (products[i].id === product.id) {
        products.splice(i, 1);
        break;
      }
    }
    // ReAdding the products after remove
    localStorage.setItem("avct_item", JSON.stringify(products));
    this.message.success(`${product.name} removed from cart successfully`);
  }

  // Fetching Locat CartsProducts
  getLocalCartProducts(): Product[] {
    const products: Product[] =
      JSON.parse(localStorage.getItem("avct_item")) || [];

    return products;
  }
}
