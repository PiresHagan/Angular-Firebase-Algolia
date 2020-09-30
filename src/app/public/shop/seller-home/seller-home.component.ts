import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/shared/interfaces/ecommerce/product';
import { Store } from 'src/app/shared/interfaces/ecommerce/store';
import { ProductService } from 'src/app/shared/services/shop/product.service';
import { StoreService } from 'src/app/shared/services/shop/store.service';
import { CartService } from 'src/app/shared/services/shop/cart.service';

@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.scss']
})
export class SellerHomeComponent implements OnInit {

  store: Store;
  storeProducts: Product[];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private storeService: StoreService,
    public cartService: CartService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {

      const slug = params.get('sellerSlug');

      this.storeService.getStoreBySlug(slug).subscribe(data => {
        this.store = data[0];

        this.productService.getProductsByStoreId(this.store.id).subscribe(data => {
          this.storeProducts = data;
        });
      });

    });
  }

}
