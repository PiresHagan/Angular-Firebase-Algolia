import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Article } from '../interfaces/article.type';

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
          const uid = a.payload.doc.id;
          return { uid, ...data };
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
  /**
   * Get comments according article id 
   * @param articleId 
   * @param limit 
   */
  getArticaleComments(articleId: string, limit: number = 5) {
    return this.db.collection(`${this.articleCollection}/${articleId}/${this.articleCommentsCollection}`, ref => ref
      .orderBy('published_on', 'desc')
      .limit(limit)
    ).snapshotChanges().pipe(map(actions => {
      return {
        commentList: actions.map(a => {

          const data: any = a.payload.doc.data();
          const uid = a.payload.doc.id;
          return { uid, ...data };
        }),
        lastCommentDoc: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      };
    })
    );
  }

  /**
   * Function is ise for getting the comments according to last received comment index.
   * @param articleId 
   * @param limit 
   * @param lastCommentDoc 
   */
  getArticleCommentNextPage(articleId: string, limit: number = 5, lastCommentDoc) {
    return this.db.collection(`${this.articleCollection}/${articleId}/${this.articleCommentsCollection}`, ref => ref
      .orderBy('published_on', 'desc')
      .startAfter(lastCommentDoc)
      .limit(limit)
    ).snapshotChanges().pipe(map(actions => {
      return {
        commentList: actions.map(a => {

          const data: any = a.payload.doc.data();
          const uid = a.payload.doc.id;
          return { uid, ...data };
        }),
        lastCommentDoc: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    })
    );
  }
  /**
   * Create comment
   * 
   * @param articleId 
   * @param commentDtails 
   */

  createComment(articleId: string, commentDtails: Comment) {
    return this.db.collection(`${this.articleCollection}/${articleId}/${this.articleCommentsCollection}`).add(commentDtails);
  }

  /**
   * Update existing comment.
   * 
   * @param articleId 
   * @param commentUid 
   * @param commentDtails 
   */
  updateComment(articleId: string, commentUid: string, commentDtails: Comment) {
    return this.db.collection(`${this.articleCollection}/${articleId}/${this.articleCommentsCollection}`).doc(commentUid).set(commentDtails)
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
