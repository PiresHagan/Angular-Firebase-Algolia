import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { map, take } from 'rxjs/operators';
import { Article } from '../interfaces/article.type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) { }

  getAll() {
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


  // get(id: string, slug: string): Observable<Article> {
  //   return this.db.doc<Article>(`_articles/${id}`).valueChanges().pipe(
  //     take(1),
  //     map(artical => {
  //       artical.id = id;
  //       return artical
  //     })
  //   );
  // }

  getArtical(slug: string) {
    return this.db.collection<Article>('posts', ref => ref
      .where('slug', '==', slug)
      .limit(1)
    ).snapshotChanges().pipe(take(1),
      map(actions => {
        return actions.map(a => {
          debugger;
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }


  getHeroLargeArticle() {
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

  getHeroSmallArticle() {
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

  getCategoryRow(slug: string) {
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

  getCategoryFirst(slug: string) {
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

  getCategory(slug: string) {
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
