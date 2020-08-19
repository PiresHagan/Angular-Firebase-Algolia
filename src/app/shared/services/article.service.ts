import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Article } from '../interfaces/article.type';
import { AngularFireStorage } from '@angular/fire/storage';
import { ACTIVE } from '../constants/status-constants';
import * as firebase from 'firebase/app';
import * as moment from 'moment';
import { STAFF } from '../constants/member-constant';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  articleCollection: string = 'articles';
  articleLikesCollection: string = 'likes';
  articleCommentsCollection: string = 'comments';
  articleImagePath: string = '/article';
  constructor(private afAuth: AngularFireAuth,
    private db: AngularFirestore, private storage: AngularFireStorage, private http: HttpClient) { }

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

    return this.http.post(environment.baseAPIDomain + '/api/v1/articles/' + articleId + "/comments", commentDtails);
  }

  /**
   * Update existing comment.
   * 
   * @param articleId 
   * @param commentid 
   * @param commentDtails 
   */
  updateComment(articleId: string, commentid: string, commentDtails: Comment) {
    return this.http.put(environment.baseAPIDomain + '/api/v1/articles/' + articleId + "/comments/" + commentid, commentDtails);
    // return this.db.collection(`${this.articleCollection}/${articleId}/${this.articleCommentsCollection}`).doc(commentid).set(commentDtails)
  }


  getHeroArticles(lang) {
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
      .where('published_at', '>=', moment().subtract(2, 'days').toISOString())
      .where('lang', "==", lang)
      .where('status', "==", ACTIVE)
      .orderBy('published_at', 'desc')
      .limit(60)
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

  getTrending(lang: string = 'en') {
    return this.db.collection<Article[]>(this.articleCollection, ref => ref
      .where('published_at', '>=', moment().subtract(30, 'days').toISOString())
      .where('lang', "==", lang)
      .where('status', "==", ACTIVE)
      .orderBy('published_at')
      .orderBy('view_count', 'desc')
      .limit(15)
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

  getLatest(lang: string = 'en') {
    return this.db.collection<Article[]>(this.articleCollection, ref => ref
      .where('published_at', '>=', moment().subtract(30, 'days').toISOString())
      .where('lang', "==", lang)
      .where('status', "==", ACTIVE)
      .orderBy('published_at', 'desc')
      .limit(15)
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

  getEditorsPick(lang: string = 'en') {
    return this.db.collection<Article[]>(this.articleCollection, ref => ref
      .where('lang', "==", lang)
      .where('status', "==", ACTIVE)
      .where('editors_pick', "==", true)
      .orderBy('published_at', 'desc')
      .limit(15)
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


  getArticlesByAuthor(authorId: string, limit: number = 10, navigation: string = "first", lastVisible = null, type = null) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection<Article[]>(`${this.articleCollection}`, ref => ref
      .where("author.id", "==", authorId)
      .where('status', "==", ACTIVE)
      .orderBy('published_at', 'desc')
      .limit(limit)
    )
    if (type) {
      dataQuery = this.db.collection<Article[]>(`${this.articleCollection}`, ref => ref
        .where("author.id", "==", authorId)
        .where('status', "==", ACTIVE)
        .where('type', "==", type)
        .orderBy('published_at', 'desc')

        .limit(limit)
      )
    }
    switch (navigation) {
      case 'next':
        dataQuery = this.db.collection<Article[]>(`${this.articleCollection}`, ref => ref
          .where("author.id", "==", authorId)
          .where('status', "==", ACTIVE)
          .orderBy('published_at', 'desc')
          .limit(limit)
          .startAfter(lastVisible))
        if (type) {
          dataQuery = this.db.collection<Article[]>(`${this.articleCollection}`, ref => ref
            .where("author.id", "==", authorId)
            .where('status', "==", ACTIVE)
            .where('type', "==", type)
            .orderBy('published_at', 'desc')
            .limit(limit)
            .startAfter(lastVisible))
        }
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




  like(articleId: string, likerData) {


    return this.http.post(environment.baseAPIDomain + '/api/v1/articles/' + articleId + "/like/", likerData).subscribe(() => {

    });


  }

  disLike(articleId: string, likerId) {
    return this.http.post(environment.baseAPIDomain + '/api/v1/articles/' + articleId + "/unlike/", {}).subscribe(() => {

    });

    // return this.db.collection(this.articleCollection).doc(articleId).collection(this.articleLikesCollection).doc(likerId).delete().then(() => {
    //   this.disLikeCount(articleId)
    // })
  }

  isLikedByUser(articleId: string, likerId) {
    return this.db.collection(this.articleCollection).doc(articleId).collection(this.articleLikesCollection).doc(likerId).valueChanges();
  }

  getArticleById(articleId: string, authorId, type: string) {
    return new Promise<any>((resolve, reject) => {
      this.db.doc(`${this.articleCollection}/${articleId}`).valueChanges().subscribe((data) => {
        if (data && data['author'].id === authorId || type == STAFF) {
          data['id'] = articleId;
          resolve(data)
        } else {
          reject('Unknown entity');
        }
      })
    })
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

