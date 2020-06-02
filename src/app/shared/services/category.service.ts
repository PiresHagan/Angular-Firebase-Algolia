import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Category } from '../interfaces/category.type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categoriesCollection: string = 'categories';

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) { }

  getAll() {
    return this.db.collection<Category[]>(this.categoriesCollection).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const uid = a.payload.doc.id;
          return { uid, ...data };
        });
      })
    );
  }

  get(id: string): Observable<Category> {
    return this.db.doc<Category>(`${this.categoriesCollection}/${id}`).valueChanges().pipe(
      take(1),
      map(category => {
        category.id = id;
        return category
      })
    );
  }
  getCategoryBySlug(slug: string) {
    return this.db.collection<Category>(this.categoriesCollection, ref => ref
      .where('slug', '==', slug)
      .limit(1)
    ).snapshotChanges().pipe(take(1),
      map(actions => {
        const categoryData = actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
        return categoryData ? categoryData[0] : {}
      })
    );
  }


}
