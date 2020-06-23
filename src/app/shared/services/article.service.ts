import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Article } from '../interfaces/article.type';
import { AngularFireStorage } from '@angular/fire/storage';
import { ACTIVE } from '../constants/status-constants';
import * as firebase from 'firebase/app';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  articleCollection: string = 'articles';
  articleLikesCollection: string = 'likes';
  articleCommentsCollection: string = 'comments';
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
          const id = a.payload.doc.id;
          const img = data.image?.url ? data.image?.url : "";
          if (img)
            data.image.url = img.replace('https://mytrendingstories.com', 'https://assets.mytrendingstories.com');
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
          const id = a.payload.doc.id;
          return { id, ...data };
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
          const id = a.payload.doc.id;
          return { id, ...data };
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
   * @param commentid 
   * @param commentDtails 
   */
  updateComment(articleId: string, commentid: string, commentDtails: Comment) {
    return this.db.collection(`${this.articleCollection}/${articleId}/${this.articleCommentsCollection}`).doc(commentid).set(commentDtails)
  }


  getHeroLargeArticle(lang) {
    return this.db.collection<Article[]>(this.articleCollection, ref => ref
      .where('lang', "==", lang)
      .where('status', "==", ACTIVE)
      .orderBy('published_at', 'desc')
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

  getHeroSmallArticle(lang) {
    return this.db.collection<Article[]>(this.articleCollection, ref => ref
      .where('lang', "==", lang)
      .where('status', "==", ACTIVE)
      .orderBy('published_at', 'desc')
      .limit(6)
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


  getCategoryRow(slug: string, lang: string = 'en') {
    return this.db.collection<Article[]>(this.articleCollection, ref => ref
      .where('category.slug', '==', slug)
      .where('lang', "==", lang)
      .where('status', "==", ACTIVE)
      .orderBy('published_at', 'desc')
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

  getCategoryFirst(slug: string, lang: string = 'en') {
    return this.db.collection<Article[]>(this.articleCollection, ref => ref
      .where('category.slug', '==', slug)
      .where('lang', "==", lang)
      .where('status', "==", ACTIVE)
      .orderBy('published_at', 'desc')
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

  getCategory(slug: string, lang: string = 'en') {
    return this.db.collection<Article[]>(this.articleCollection, ref => ref
      .where('category.slug', '==', slug)
      .where('lang', "==", lang)
      .where('status', "==", ACTIVE)
      .orderBy('published_at', 'desc')
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

  getToday(lang: string = 'en') {
    return this.db.collection<Article[]>(this.articleCollection, ref => ref
      .where('published_at', '>=', moment().subtract(1, 'days').toISOString())
      .where('lang', "==", lang)
      .where('status', "==", ACTIVE)
      .orderBy('published_at', 'desc')
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

  getArticlesByAuthor_old(authorId: string, limit: number = 10) {
    return this.db.collection<Article[]>(this.articleCollection, ref => ref
      .where('author.id', '==', authorId)
      .where('status', "==", ACTIVE)
      .orderBy('published_at', 'desc')
      .limit(limit)
    ).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    )

  }


  getArticlesByAuthor(authorId: string, limit: number = 10, navigation: string = "first", lastVisible = null) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection<Article[]>(`${this.articleCollection}`, ref => ref
      .where("author.id", "==", authorId)
      .where('status', "==", ACTIVE)
      .orderBy('published_at', 'desc')
      .limit(limit)
    )
    switch (navigation) {
      case 'next':
        dataQuery = this.db.collection<Article[]>(`${this.articleCollection}`, ref => ref
          .where("author.id", "==", authorId)
          .where('status', "==", ACTIVE)
          .orderBy('published_at', 'desc')
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


  getArticles(authorId, limit: number = 10, navigation: string = "first", lastVisible = null) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection<Article[]>(`${this.articleCollection}`, ref => ref
      .where("author.id", "==", authorId)
      .where('status', "==", ACTIVE)
      .orderBy('published_at', 'desc')
      .limit(limit)
    )
    switch (navigation) {
      case 'next':
        dataQuery = this.db.collection<Article[]>(`${this.articleCollection}`, ref => ref
          .where("author.id", "==", authorId)
          .where('status', "==", ACTIVE)
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

  getArticlesByUser(authorId, limit: number = 10, navigation: string = "first", lastVisible = null) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection<Article[]>(`${this.articleCollection}`, ref => ref
      .where("author.id", "==", authorId)
      .orderBy('created_at', 'desc')
      .limit(limit)
    )
    switch (navigation) {
      case 'next':
        dataQuery = this.db.collection<Article[]>(`${this.articleCollection}`, ref => ref
          .where("author.id", "==", authorId)
          .orderBy('created_at', 'desc')
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

  getArticlesBySlug(limit: number = 10, navigation: string = "first", lastVisible = null, categorySlug: string = null, topicSlug: string = '', lang: string = 'en') {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection<Article[]>(`${this.articleCollection}`, ref => ref
      .where("category.slug", "==", categorySlug)
      .where("lang", "==", lang)
      .where('status', "==", ACTIVE)
      .orderBy('published_at', 'desc')
      .limit(limit))
    if (topicSlug) {
      dataQuery = this.db.collection<Article[]>(`${this.articleCollection}`, ref => ref
        .where("category.slug", "==", categorySlug)
        .where("lang", "==", lang)
        .where('status', "==", ACTIVE)
        .where("topic_list", "array-contains-any", [topicSlug])
        .orderBy('published_at', 'desc')
        .limit(limit)
      )
    }

    switch (navigation) {
      case 'next':
        if (topicSlug)
          dataQuery = this.db.collection<Article[]>(`${this.articleCollection}`, ref => ref
            .where("category.slug", "==", categorySlug)
            .where("lang", "==", lang)
            .where('status', "==", ACTIVE)
            .where("topics_list", "array-contains-any", [topicSlug])
            .orderBy('published_at', 'desc')
            .limit(limit)
            .startAfter(lastVisible))
        else
          dataQuery = this.db.collection<Article[]>(`${this.articleCollection}`, ref => ref
            .where("category.slug", "==", categorySlug)
            .where("lang", "==", lang)
            .where('status', "==", ACTIVE)
            .orderBy('published_at', 'desc')
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

  updateArticleCommentAbuse(articleId: string, commentid: string) {
    return new Promise<any>((resolve, reject) => {
      this.db.collection(`${this.articleCollection}/${articleId}/${this.articleCommentsCollection}`).doc(commentid).update({ is_abused: true }).then(() => {
        resolve();
      })
    })
  }

  createArticle(article) {
    return new Promise((resolve, reject) => {
      article.slug = article.slug + '-' + this.makeid()
      this.db.collection(`${this.articleCollection}`).add(article).then((articleData) => {
        resolve(articleData)
      })
    }).catch((error) => {
      console.log(error)
    })
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
    return this.db.collection(this.articleCollection).doc(articleId).collection(this.articleLikesCollection).doc(likerData.id).set(likerData).then(() => {
      this.likeCount(articleId)
    })
  }

  disLike(articleId: string, likerId) {
    return this.db.collection(this.articleCollection).doc(articleId).collection(this.articleLikesCollection).doc(likerId).delete().then(() => {
      this.disLikeCount(articleId)
    })
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

  makeid(length = 6) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  updateViewCount(articleId: string) {
    const db = firebase.firestore();
    const increment = firebase.firestore.FieldValue.increment(1);
    const articleRef = db.collection(this.articleCollection).doc(articleId);
    articleRef.update({ view_count: increment })
  }
  commentCount(articleId: string) {
    const db = firebase.firestore();
    const increment = firebase.firestore.FieldValue.increment(1);
    const articleRef = db.collection(this.articleCollection).doc(articleId);
    articleRef.update({ comments_count: increment })
  }
  likeCount(articleId: string) {
    const db = firebase.firestore();
    const increment = firebase.firestore.FieldValue.increment(1);
    const articleRef = db.collection(this.articleCollection).doc(articleId);
    articleRef.update({ likes_count: increment })
  }
  disLikeCount(articleId: string) {
    const db = firebase.firestore();
    const increment = firebase.firestore.FieldValue.increment(-1);
    const articleRef = db.collection(this.articleCollection).doc(articleId);
    articleRef.update({ likes_count: increment })
  }
  deleteArticle(articleId) {
    return this.db.collection(this.articleCollection).doc(articleId).delete();
  }

}

