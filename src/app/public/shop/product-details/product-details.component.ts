import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/shared/interfaces/ecommerce/product';
import { ProductReview } from 'src/app/shared/interfaces/ecommerce/review';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { CartService } from 'src/app/shared/services/shop/cart.service';
import { ProductService } from 'src/app/shared/services/shop/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  isLoggedInUser: boolean;
  isAdding: boolean = false;
  product: Product;
  fashionProducts: Array<Product>;

  productReviews: Array<ProductReview>;
  lastVisibleReviews;
  loadingMoreReviews: boolean = false;

  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    public cartService: CartService,
    private productService: ProductService,
    private router: Router
  ) { }
  isVisible = false;
  isOkLoading = false;
  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.router.navigate(["auth/login"]);
      this.isOkLoading = false;
    }, 2000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {

      const slug = params.get('productSlug');

      this.productService.getProductBySlug(slug).subscribe(data => {
        this.product = data[0];

        this.getFirstReviews();

        // this.productService.updateProductViewCount(this.product);
      });

    });

    this.authService.getAuthState().subscribe(user => {
      if (user && !user.isAnonymous) {
        this.isLoggedInUser = true;
      } else {
        this.isLoggedInUser = false;
      }
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
  showRating(){
    this.authService.getAuthState().subscribe(user => {
      if (user && !user.isAnonymous) {
        this.isLoggedInUser = true;
        document.getElementById('rating-box').style.display = 'block';
      } else {
        this.isLoggedInUser = false;
        this.isVisible = true;
      }
    });
    
  }
  
}
