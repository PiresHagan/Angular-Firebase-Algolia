import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Article } from '../interfaces/article.type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  articleCollection: string = 'bak_posts';
  articleLikesCollection: string = '_likes';
  articleCommentsCollection: string = '_comments';
  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) { }

  getAll() {
    return this.db.collection<Article[]>(this.articleCollection).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getArtical(slug: string) {
    return this.db.collection<Article>(this.articleCollection, ref => ref
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

  getArticalLikes(articleId: string) {
    return this.db.collection(this.articleLikesCollection, ref => ref
      .where('fields.article', '==', articleId)
    ).snapshotChanges().pipe(map(actions => {
      return actions.length;
    })
    );
  }
  getArticaleComments(articleId: string, limit: number = 5) {
    return this.db.collection(this.articleCommentsCollection, ref => ref
      .where('fields.article', '==', articleId).orderBy('fields.published_on', 'desc')
      .limit(limit)
    ).snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data['fields'] };
      });
    })
    );
  }
  createComment(commentDtails) {
    return this.db.collection(this.articleCommentsCollection).add(commentDtails);
  }


  getHeroLargeArticle() {
    return this.db.collection<Article[]>(this.articleCollection, ref => ref
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
    return this.db.collection<Article[]>(this.articleCollection, ref => ref
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
    return this.db.collection<Article[]>(this.articleCollection, ref => ref
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
    return this.db.collection<Article[]>(this.articleCollection, ref => ref
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
    return this.db.collection<Article[]>(this.articleCollection, ref => ref
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
  getArticlesByAuthor(authorId: string, limit: number = 10) {
    return this.db.collection<Article[]>(this.articleCollection, ref => ref
      .where('author', '==', authorId)
      .orderBy('created_at', 'desc')
      .limit(limit)
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
