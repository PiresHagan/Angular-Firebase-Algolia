import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/shared/interfaces/ecommerce/product';
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

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {

      const slug = params.get('productSlug');

      this.productService.getProductBySlug(slug).subscribe(data => {
        this.product = data[0];
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

}
