import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../interfaces/ecommerce/product';
import { CartService } from '../../services/shop/cart.service';

@Component({
  selector: 'shop-product-card',
  templateUrl: './shop-product-card.component.html',
  styleUrls: ['./shop-product-card.component.scss']
})
export class ShopProductCardComponent implements OnInit {

  @Input() product: Product;
  isAdding: boolean = false;

  constructor(
    private cartService: CartService
  ) { }

  ngOnInit(): void {
  }

  addToCart() {
    this.isAdding = true;
    this.cartService.addToCart(this.product);
    setTimeout(()=> {
      this.isAdding = false;
    }, 1000)
  }

}
