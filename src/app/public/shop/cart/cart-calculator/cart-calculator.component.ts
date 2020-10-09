import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
  OnDestroy
} from "@angular/core";
import { Product } from "src/app/shared/interfaces/ecommerce/product";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cart-calculator',
  templateUrl: './cart-calculator.component.html',
  styleUrls: ['./cart-calculator.component.scss']
})
export class CartCalculatorComponent implements OnInit, OnChanges, OnDestroy {
  
  @Input() products: Product[];

  @Input() config: {
    isCheckout: boolean;
  }

  totalValue = 0;
  constructor(
    public translate: TranslateService,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    const dataChanges: SimpleChange = changes.products;

    const products: Product[] = dataChanges.currentValue;
    this.totalValue = 0;
    products.forEach((product) => {
      if(product.discountedPrice) {
        this.totalValue += product.discountedPrice;
      } else {
        this.totalValue += product.salePrice;
      }
    });
  }

  ngOnInit() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('hide-modal-footer');
  }

  ngOnDestroy(){
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('hide-modal-footer');
  }

}
