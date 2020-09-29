import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { take, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Product, ProductStatusTypes } from '../../interfaces/ecommerce/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  storeProductsCollection = 'store-products';

  constructor(
    public db: AngularFirestore
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

  
}
