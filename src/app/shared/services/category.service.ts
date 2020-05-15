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
  categoriesCollection: string = 'bak_categories';

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) { }

  getAll() {
    return this.db.collection<Category[]>(this.categoriesCollection).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
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


}
