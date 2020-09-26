import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../interfaces/ecommerce/product';

@Component({
  selector: 'shop-product-card',
  templateUrl: './shop-product-card.component.html',
  styleUrls: ['./shop-product-card.component.scss']
})
export class ShopProductCardComponent implements OnInit {

  @Input() product: Product;

  constructor() { }

  ngOnInit(): void {
  }

}
