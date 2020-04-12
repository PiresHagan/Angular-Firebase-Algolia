import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Category } from '../interfaces/category.type';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) { }

  getAll(){
    return this.db.collection<Category>('categories').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }
}
