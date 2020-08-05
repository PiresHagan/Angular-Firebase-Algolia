import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Article } from '../interfaces/article.type';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  cacheCollection: string = 'cache';
  topContributorsDoc: string = 'top-contributors';
  sponsoredPostsDoc: string = 'sponsored-posts';
  searchEngineDoc: string = 'search-engines';

  constructor(private db: AngularFirestore) { }

  getSponsoredArticles(lang: string) {
    return this.db.collection<Article[]>(`${this.cacheCollection}/${this.sponsoredPostsDoc}/${lang}`, ref => ref).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          return data;
        });
      })
    );
  }

  getTopContributors(lang: string) {
    return this.db.collection(`${this.cacheCollection}/${this.topContributorsDoc}/${lang}`, ref => ref).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          return data;
        });
      })
    );
  }

  getBrands() {
    return this.db.collection(`${this.cacheCollection}/${this.searchEngineDoc}/data`, ref => ref).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          return data;
        });
      })
    );
  }
}
