import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from 'src/environments/environment';

import { Product } from '../../interfaces/ecommerce/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private http: HttpClient,
    private message: NzMessageService,
  ) { }

  // Adding new Product to cart db if logged in else localStorage
  addToCart(data: Product): void {

    const a: Product[] = JSON.parse(localStorage.getItem("avct_item")) || [];
    a.push(data);

    this.updateCartDataInFirestore(a);

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

    this.updateCartDataInFirestore(products);
    // ReAdding the products after remove
    localStorage.setItem("avct_item", JSON.stringify(products));
    this.message.success(`${product.name} removed from cart successfully`);
  }

  // Clear all cart items 
  clearCart() {
    const products: Product[] = [];

    this.updateCartDataInFirestore(products);

    localStorage.setItem("avct_item", JSON.stringify(products));
  }

  // Fetching Locat CartsProducts
  getLocalCartProducts(): Product[] {
    const products: Product[] =
      JSON.parse(localStorage.getItem("avct_item")) || [];

    return products;
  }

  updateCartDataInFirestore(products: Product[]) {
    this.http.put(environment.baseAPIDomain + `/api/v1/carts`, { products });
  }

  placeOrder(orderData) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + `/api/v1/store-orders`, orderData).subscribe((result) => {
        resolve(result)
      }, (error) => {
        reject(error)
      })
    })
  }
  getShippingCarrier(shippingData) {
    return this.http.post(environment.baseAPIDomain + `/api/v1/stores/7AGTcOSL3WcwRZe40YAJ/shippingRates`, shippingData);
    // return this.http.post(environment.baseAPIDomain + `/api/v1/stores/7AGTcOSL3WcwRZe40YAJ/shippingRates`, {
    //   weight: 10,
    //   postal_code: '91521',
    //   country_code: 'US'
    // });
  }


}
