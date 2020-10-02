import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/interfaces/ecommerce/product';
import { ProductService } from 'src/app/shared/services/shop/product.service';
import { CartService } from 'src/app/shared/services/shop/cart.service';
@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent implements OnInit {
  @Input() product:Product;
  topProducts: Array<Product>;
  constructor(private productService: ProductService, public cartService: CartService) { }

  ngOnInit(): void {
    this.productService.getTopProducts().subscribe((data: any) => {
      this.topProducts = data;
    })
  }

}
