import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { map } from 'rxjs/operators';
import { Article } from '../interfaces/article.type';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) { }

  getAll(){
    return this.db.collection<Article[]>('posts').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getHeroLargeArticle(){
    return this.db.collection<Article[]>('posts', ref => ref
          .orderBy('created_at', 'desc')
          .limit(1)
        ).snapshotChanges().pipe(
          map(actions => {
            return actions.map(a => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;
              return { id, ...data };
            });
          })
        );
  }

  getHeroSmallArticle(){
    return this.db.collection<Article[]>('posts', ref => ref
          .orderBy('created_at', 'desc')
          .limit(5)
        ).snapshotChanges().pipe(
          map(actions => {
            return actions.map(a => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;
              return { id, ...data };
            });
          })
        );
  }

  getCategoryRow(slug:string){
    return this.db.collection<Article[]>('posts', ref => ref
          .where('categoryObj.slug', '==', slug)
          .orderBy('created_at', 'desc')
          .limit(5)
        ).snapshotChanges().pipe(
          map(actions => {
            return actions.map(a => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;
              return { id, ...data };
            });
          })
        );
  }

  getCategoryFirst(slug:string){
    return this.db.collection<Article[]>('posts', ref => ref
          .where('categoryObj.slug', '==', slug)
          .orderBy('created_at', 'desc')
          .limit(1)
        ).snapshotChanges().pipe(
          map(actions => {
            return actions.map(a => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;
              return { id, ...data };
            });
          })
        );
  }

  getCategory(slug:string){
    return this.db.collection<Article[]>('posts', ref => ref
          .where('categoryObj.slug', '==', slug)
          .orderBy('created_at', 'desc')
          .limit(30)
        ).snapshotChanges().pipe(
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
