import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from 'src/app/shared/interfaces/ecommerce/store';
import { StoreService } from 'src/app/shared/services/shop/store.service';

@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.scss']
})
export class SellerHomeComponent implements OnInit {

  store: Store;

  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {

      const slug = params.get('slug');

      this.storeService.getStoreBySlug(slug).subscribe(data => {
        this.store = data[0];
      });

    });
  }

}
