import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { Store } from '../../interfaces/ecommerce/store';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  storeCollection = 'stores';

  constructor(
    public db: AngularFirestore
  ) { }

  getAllStores(): Observable<any> {
    return this.db.collection<Store>(this.storeCollection, ref => ref.where('stripe_status', '==', 'active')).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => a.payload.doc.data());
      })
    );
  }

  getStoreBySlug(slug: string) {
    return this.db.collection<Store>(this.storeCollection, ref => ref
      .where('slug', '==', slug)
      .limit(1)
    ).snapshotChanges().pipe(take(1),
      map(actions => {
        return actions.map(a => a.payload.doc.data());
      })
    );
  }

}
