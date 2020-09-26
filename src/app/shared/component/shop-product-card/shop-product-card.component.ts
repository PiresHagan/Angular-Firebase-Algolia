import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-shop-product-card',
  templateUrl: './shop-product-card.component.html',
  styleUrls: ['./shop-product-card.component.scss']
})
export class ShopProductCardComponent implements OnInit {

  @Input() product;

  constructor() { }

  ngOnInit(): void {
  }

}
