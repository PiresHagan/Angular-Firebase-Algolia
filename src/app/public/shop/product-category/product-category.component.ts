import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/interfaces/ecommerce/product';
import { ProductService } from 'src/app/shared/services/shop/product.service';
@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent implements OnInit {
  @Input() product:Product;
  topProducts: Array<Product>;
  dummyProducts = [
    {
        id: "122121212",
        title: "royalex watch for men",
        slug: "reree",
        summary: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        price: {
            salePrice: 80,
            unitPrice: 100
        }
    },
    {
      id: "122121212",
      title: "royalex watch for men",
      slug: "reree",
      summary: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      price: {
          salePrice: 80,
          unitPrice: 100
      }
    },
    {
      id: "122121212",
      title: "royalex watch for men",
      slug: "reree",
      summary: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      price: {
          salePrice: 80,
          unitPrice: 100
      }
    },
    {
      id: "122121212",
      title: "royalex watch for men",
      slug: "reree",
      summary: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      price: {
          salePrice: 80,
          unitPrice: 100
      }
    },
    {
      id: "122121212",
      title: "royalex watch for men",
      slug: "reree",
      summary: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      price: {
          salePrice: 80,
          unitPrice: 100
      }
    }
  ];
  constructor(private productService: ProductService,) { }

  ngOnInit(): void {
    this.productService.getTopProducts().subscribe((data: any) => {
      this.topProducts = [...data, ...this.dummyProducts];
    })
  }

}
