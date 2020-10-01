import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { take, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Product, ProductStatusTypes } from '../../interfaces/ecommerce/product';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  storeProductsCollection = 'store-products';
  productCategoriesCollection = 'store-product-categories';
  reviewsCollection = 'reviews';

  constructor(
    public db: AngularFirestore,
    private http: HttpClient,
    private message: NzMessageService,
  ) { }

  getAllProducts(): Observable<any> {
    return this.db.collection(this.storeProductsCollection).valueChanges()
  }

  getProductsByStoreId(storeId: string): Observable<any> {
    return this.db.collection<Product>(this.storeProductsCollection, ref => ref
      .where('storeId', '==', storeId)
      .where('status', '==', ProductStatusTypes.INSTOCK)
    ).snapshotChanges().pipe(map(actions => {
        return actions.map(a => a.payload.doc.data());
      })
    );
  }

  getProductBySlug(slug: string) {
    return this.db.collection<Product>(this.storeProductsCollection, ref => ref
      .where('slug', '==', slug)
      .limit(1)
    ).snapshotChanges().pipe(take(1),
      map(actions => {
        return actions.map(a => a.payload.doc.data());
      })
    );
  }

  getProductsByCategoryId(categoryId: string) {
    let dataQuery = this.db.collection<Product[]>(`${this.storeProductsCollection}`, ref => ref
      .where("category.id", "==", categoryId)
      .where('status', '==', ProductStatusTypes.INSTOCK));

    return dataQuery.snapshotChanges().pipe(map(actions => {
      return actions.map(a => a.payload.doc.data())
    }));
  }

  getTopProducts() {
    let dataQuery = this.db.collection<Product[]>(`${this.storeProductsCollection}`, ref => ref
      .where('status', '==', ProductStatusTypes.INSTOCK)
      .limit(5));

    return dataQuery.snapshotChanges().pipe(map(actions => {
      return actions.map(a => a.payload.doc.data())
    }));
  }

  getFashionForEveryoneProducts() {
    let dataQuery = this.db.collection<Product[]>(`${this.storeProductsCollection}`, ref => ref
      .where('status', '==', ProductStatusTypes.INSTOCK)
      .limit(5));

    return dataQuery.snapshotChanges().pipe(map(actions => {
      return actions.map(a => a.payload.doc.data())
    }));
  }

  getProductForTodaysDeal() {
    let dataQuery = this.db.collection<Product[]>(`${this.storeProductsCollection}`, ref => ref
      .where('status', '==', ProductStatusTypes.INSTOCK)
      .limit(5));

    return dataQuery.snapshotChanges().pipe(map(actions => {
      return actions.map(a => a.payload.doc.data())
    }));
  } 

  getAllProductCategories(): Observable<any> {
    return this.db.collection(this.productCategoriesCollection).valueChanges()
  }

  getProductByCategory(categoryId: string) {
    let dataQuery = this.db.collection<Product[]>(`${this.storeProductsCollection}`, ref => ref
      .where('status', '==', ProductStatusTypes.INSTOCK)
      .where('categories.id', '==', categoryId));

    return dataQuery.snapshotChanges().pipe(map(actions => {
      return actions.map(a => a.payload.doc.data())
    }));
  }

  addProductReview(product: Product, review) {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.baseAPIDomain}/api/v1/stores/${product.storeId}/products/${product.id}/reviews`, review)
      .subscribe((result) => {
        this.message.success(`Thank you for your review`);
        resolve(result) 
      }, (error) => {
        this.message.error(error.message);
        reject(error)
      })
    })
  }

  getProductReviews(productId, limit: number = 5, navigation: string = "first", lastVisible = null) {
    if (!limit) {
      limit = 5;
    }
    let dataQuery = this.db.collection(this.storeProductsCollection).doc(productId).collection(`${this.reviewsCollection}`, ref => ref
      .orderBy('created_at', 'desc')
      .limit(limit)
    )
    switch (navigation) {
      case 'next':
        dataQuery = this.db.collection(this.storeProductsCollection).doc(productId).collection(`${this.reviewsCollection}`, ref => ref
          .orderBy('created_at', 'desc')
          .limit(limit)
          .startAfter(lastVisible))
        break;
    }
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        reviews: actions.map(a => {
          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    }));
  }

  updateProductViewCount(product: Product) {
    this.http.post(`${environment.baseAPIDomain}/api/v1/stores/${product.storeId}/products/${product.id}/view`, {}).subscribe(data => {
      console.log(data);
    }, err => {
      console.log(err);
    })
  }

}
