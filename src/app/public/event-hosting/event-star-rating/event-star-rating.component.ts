import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-product-star-rating-group',
  templateUrl: './event-star-rating.component.html',
  styleUrls: ['./event-star-rating.component.scss']
})
export class ProductStarRatingComponent implements OnInit {

  @Input() rating: number;
  rating_new: number;
  tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
  @Output()  starRateEvent = new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {
    this.rating_new = this.rating;
  }
  setRating(newValue){
    this.starRateEvent.emit(this.rating_new);
  }
 
}
