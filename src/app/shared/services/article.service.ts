import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { switchMap, map } from 'rxjs/operators';
import { Article } from '../interfaces/article.type';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) { }

  getAll(){
    return this.db.collection<Article>('posts').snapshotChanges().pipe(
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
