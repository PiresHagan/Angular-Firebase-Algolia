import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/shared/interfaces/ecommerce/category';
import { ProductService } from 'src/app/shared/services/shop/product.service';

@Component({
  selector: 'app-mega-menu',
  templateUrl: './mega-menu.component.html',
  styleUrls: ['./mega-menu.component.scss']
})
export class MegaMenuComponent implements OnInit {
  rotateArrow: string = '';
  categories: Array<ProductCategory>;
  constructor(
    private productService: ProductService,
  ) { }

  ngOnInit(): void {
    this.productService.getAllProductCategories().subscribe((data: any) => {
      this.categories = data;
    })
  }
  hideMegaMenu() {
    document.getElementById('mega-menu-body').style.display = 'none';
    
  }
  showMegaMenu() {
    document.getElementById('mega-menu-body').style.display = 'block';
  }
}
