import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-star-rating',
  templateUrl: './product-star-rating.component.html',
  styleUrls: ['./product-star-rating.component.scss']
})
export class ProductStarRatingComponent implements OnInit {

  @Input() rating: number;
  constructor() { }

  ngOnInit(): void {
  }

}
