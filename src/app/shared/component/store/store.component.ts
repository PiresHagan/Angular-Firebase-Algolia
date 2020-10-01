import { Component, OnInit, Input } from '@angular/core';
import { Store } from '../../interfaces/ecommerce/store';
import { StoreService } from 'src/app/shared/services/shop/store.service';
@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})

export class StoreComponent implements OnInit {

  @Input() store: Store;
  
  constructor(
    private storeService: StoreService
  ) { }

  ngOnInit(): void {

  }

}
