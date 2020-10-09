import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/shared/interfaces/ecommerce/product';
import { ProductReview } from 'src/app/shared/interfaces/ecommerce/review';
import { CartService } from 'src/app/shared/services/shop/cart.service';
import { ProductService } from 'src/app/shared/services/shop/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  isAdding: boolean = false;
  product: Product;
  fashionProducts: Array<Product>;

  productReviews: Array<ProductReview>;
  lastVisibleReviews;
  loadingMoreReviews: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public cartService: CartService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {

      const slug = params.get('productSlug');

      this.productService.getProductBySlug(slug).subscribe(data => {
        this.product = data[0];

        this.getFirstReviews();

        this.productService.updateProductViewCount(this.product);
      });

    });

    this.productService.getFashionForEveryoneProducts().subscribe((data: any) => {
      this.fashionProducts = data;
    })
  }

  addToCart() {
    this.isAdding = true;
    this.cartService.addToCart(this.product);
    setTimeout(()=> {
      this.isAdding = false;
    }, 1000)
  }

  getFirstReviews() {
    this.productService.getProductReviews(this.product.id, 2, null, this.lastVisibleReviews).subscribe((data) => {
      this.loadingMoreReviews = false;

      this.productReviews = data.reviews;

      this.lastVisibleReviews = data.lastVisible;
    });
  }

  loadMoreReviews(action = "next") {
    this.loadingMoreReviews = true;
    this.productService.getProductReviews(this.product.id, 5, action, this.lastVisibleReviews).subscribe((data) => {
      this.loadingMoreReviews = false;
      let mergedData: any = [...this.productReviews, ...data.reviews];
      this.productReviews = this.getDistinctArray(mergedData);
      this.lastVisibleReviews = data.lastVisible;
    });
  }

  getDistinctArray(data) {
    var resArr = [];
    data.filter(function (item) {
      var i = resArr.findIndex(x => x.id == item.id);
      if (i <= -1) {
        resArr.push(item);
      }
      return null;
    });
    return resArr;
  }
  
}
