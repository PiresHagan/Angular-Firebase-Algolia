import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/shared/interfaces/ecommerce/product';
import { ProductService } from 'src/app/shared/services/shop/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  product: Product;
  fashionProducts: Array<Product>;
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
  constructor(
    private route: ActivatedRoute,
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
      this.fashionProducts = [...data, ...this.dummyProducts];
    })
  }

}
