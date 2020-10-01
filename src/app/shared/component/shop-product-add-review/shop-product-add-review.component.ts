import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Product } from '../../interfaces/ecommerce/product';
import { ProductService } from '../../services/shop/product.service';

@Component({
  selector: 'app-shop-product-add-review',
  templateUrl: './shop-product-add-review.component.html',
  styleUrls: ['./shop-product-add-review.component.scss']
})

export class ShopProductAddReviewComponent implements OnInit {

  @Input() product: Product;

  tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

  isFormSaving: boolean = false;
  reviewForm: FormGroup;
  
  constructor(
    private productService: ProductService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      rating: [null, [Validators.required]],
      title: [null, [Validators.required]],
      remark: [null, [Validators.required]]
    });
  }

  checkReviewForm() {
    for (const i in this.reviewForm.controls) {
      this.reviewForm.controls[i].markAsDirty();
      this.reviewForm.controls[i].updateValueAndValidity();
    }

    if(this.reviewForm.valid) {
      this.isFormSaving = true;
      this.submitReview(this.reviewForm.value);
      document.getElementById('rating-box').style.display = 'none';
    }
  }

  submitReview(reviewData) {
    this.productService.addProductReview(this.product, reviewData).then( result => {
      this.reviewForm.reset();
      this.isFormSaving = false;
    }).catch( err => {
      this.isFormSaving = false;
    });
  }
  
}
