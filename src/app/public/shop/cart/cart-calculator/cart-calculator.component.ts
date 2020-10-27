import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
  OnDestroy,
  Output,
  EventEmitter
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
  @Input() currentStep;


  totalValue: any = 0;
  totalWithShipping = 0;
  currentStepData = 0;

  constructor(
    public translate: TranslateService,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.products) {
      const dataChanges: SimpleChange = changes.products;
      const products: Product[] = dataChanges.currentValue;
      this.updatePriceData(products);
    }
    if (changes.currentStep) {
      const currentStepChanges: SimpleChange = changes.currentStep;
      this.currentStepData = currentStepChanges.currentValue;

    }
  }

  ngOnInit() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('hide-modal-footer');
  }

  ngOnDestroy() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('hide-modal-footer');
  }

  updatePriceData(storeShippingData) {
    this.totalWithShipping = 0;
    this.totalValue = 0;
    console.log(storeShippingData)
    this.totalValue = 0;
    this.products.forEach((product) => {
      if (product.discountedPrice) {
        this.totalValue += parseFloat(product.discountedPrice);
      } else {
        this.totalValue += parseFloat(product.salePrice);

      }


    });
    for (const key in storeShippingData) {
      const store = storeShippingData[key];
      this.totalWithShipping += parseFloat(store['shipping_price'] ? store['shipping_price'] : 0);
    }

    this.totalValue = parseFloat(this.totalValue) + this.totalWithShipping
  }


}
