import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Product } from '../../interfaces/ecommerce/product';
import { ProductService } from '../../services/shop/product.service';
import { AuthService } from '../../services/authentication.service';

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
  reviewId = null;
  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      rating: [null, [Validators.required]],
      title: [null, [Validators.required, Validators.maxLength(50), Validators.minLength(10)]],
      remark: [null, [Validators.required, Validators.maxLength(100), Validators.minLength(10)]]
    });
  }

  checkReviewForm() {
    for (const i in this.reviewForm.controls) {
      this.reviewForm.controls[i].markAsDirty();
      this.reviewForm.controls[i].updateValueAndValidity();
    }

    if (this.reviewForm.valid) {
      this.isFormSaving = true;
      this.submitReview(this.reviewForm.value);
      //document.getElementById('rating-box').style.display = 'none';
    }
  }
  async getuserProductReview() {
    let userDetails = await this.auth.getLoggedInUserDetails();
    this.productService.getUserProductReview(this.product.id, userDetails.id).subscribe((data: any) => {
      if (data && data.reviews[0]) {
        this.reviewForm.controls['rating'].setValue(data.reviews[0].rating);
        this.reviewForm.controls['title'].setValue(data.reviews[0].title);
        this.reviewForm.controls['remark'].setValue(data.reviews[0].remark);
        this.reviewId = data.reviews[0].id;
      }

    })
  }

  submitReview(reviewData) {
    if (!this.reviewId) {
      this.productService.addProductReview(this.product, reviewData).then(result => {
        this.reviewForm.reset();
        this.isFormSaving = false;
      }).catch(err => {
        this.isFormSaving = false;
      });
    } else {
      this.productService.updateProdutReview(this.product, reviewData, this.reviewId).then(result => {
        this.reviewForm.reset();
        this.isFormSaving = false;
      }).catch(err => {
        this.isFormSaving = false;
      });
    }

  }
}
