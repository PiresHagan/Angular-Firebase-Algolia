import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
} from "@angular/core";
import { Product } from "src/app/shared/interfaces/ecommerce/product";
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { User } from 'src/app/shared/interfaces/user.type';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cart-calculator',
  templateUrl: './cart-calculator.component.html',
  styleUrls: ['./cart-calculator.component.scss']
})
export class CartCalculatorComponent implements OnInit, OnChanges {
  userDetails: User;
  isLoggedInUser: boolean = false;
  @Input() products: Product[];
  @Input() config: {
    isCheckout: boolean;
  }

  totalValue = 0;
  constructor(
    private router: Router,
    public authService: AuthService,
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
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user) {
        this.userDetails = null;
        this.isLoggedInUser = false;
        return;
      }
      if (this.userDetails) {
        this.isLoggedInUser = true;
      } else {
        this.isLoggedInUser = false;
     
      }
  
  
  
    });
  }
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

  checkLoginCheckout(){
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user.isAnonymous) {
        this.router.navigate(["/shop/checkout"]);
      } else {
        this.showModal()
      }
    });
  }
}
