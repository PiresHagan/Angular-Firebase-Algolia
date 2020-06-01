import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Article } from '../interfaces/article.type';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  articleCollection: string = 'bak_posts';
  articleLikesCollection: string = '_likes';
  articleCommentsCollection: string = '_comments';
  articleImagePath: string = '/article';
  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, private storage: AngularFireStorage, ) { }

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
    if (!limit) {
      limit = 5;
    }
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
  getArticles(authorId, limit: number = 10, navigation: string = "first", lastVisible = null) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection<Article[]>(`${this.articleCollection}`, ref => ref
      .where("author.id", "==", authorId)
      .limit(limit)
    )
    switch (navigation) {
      case 'next':
        dataQuery = this.db.collection<Article[]>(`${this.articleCollection}`, ref => ref
          .where("author.id", "==", authorId)
          //  .orderBy('published_on', 'desc')
          .limit(limit)
          .startAfter(lastVisible))
        break;
    }
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        articleList: actions.map(a => {

          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    })
    );
  }

  updateArticleAbuse(articleId: string) {
    return new Promise<any>((resolve, reject) => {
      this.db.collection(`${this.articleCollection}`).doc(`${articleId}`).update({ is_abused: true }).then(() => {
        resolve();
      })
    })
  }

  updateArticleCommentAbuse(articleId: string, commentUid: string) {
    return new Promise<any>((resolve, reject) => {
      this.db.collection(`${this.articleCollection}/${articleId}/${this.articleCommentsCollection}`).doc(commentUid).update({ is_abused: true }).then(() => {
        resolve();
      })
    })
  }

  createArticle(article) {
    return this.db.collection(`${this.articleCollection}`).add(article);
  }

  updateArticleImage(articleId, imageDetails) {
    return new Promise<any>((resolve, reject) => {
      this.db.collection(`${this.articleCollection}`).doc(`${articleId}`).update(imageDetails).then(() => {
        resolve();
      })
    })
  }

  addArticleImage(articleId: string, imageDetails: any) {
    const path = `${this.articleImagePath}/${Date.now()}_${imageDetails.file.name}`;
    return new Promise((resolve, reject) => {
      this.storage.upload(path, imageDetails.file).then(
        snapshot => {
          snapshot.ref.getDownloadURL().then((downloadURL) => {
            const imageUrl: string = downloadURL;
            this.updateArticleImage(articleId, { image: { url: imageUrl, alt: imageDetails.alt } }).then(res => resolve()).catch(err => reject(err))
          }).catch(err => reject(err))
        }).catch((error) => {
          console.log(error);
          reject();
        });

    })
  }
  like(articleId: string, likerData) {
    return this.db.collection(this.articleCollection).doc(articleId).collection(this.articleLikesCollection).doc(likerData.id).set(likerData);
  }

  disLike(articleId: string, likerId) {
    return this.db.collection(this.articleCollection).doc(articleId).collection(this.articleLikesCollection).doc(likerId).delete();
  }

  isLikedByUser(articleId: string, likerId) {
    return this.db.collection(this.articleCollection).doc(articleId).collection(this.articleLikesCollection).doc(likerId).valueChanges();
  }

  getArticleById(articleId: string, authorId) {
    return new Promise<any>((resolve, reject) => {
      this.db.doc(`${this.articleCollection}/${articleId}`).valueChanges().subscribe((data) => {
        if (data && data['author'].id === authorId) {
          data['id'] = articleId;
          resolve(data)
        } else {
          reject('Unknown entity');
        }
      })





    })

  }
  updateArticle(articleId: string, articleDetails) {
    return this.db.collection(`${this.articleCollection}`).doc(`${articleId}`).set(articleDetails)
  }






}

