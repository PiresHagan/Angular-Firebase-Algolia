
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';

import { AngularFireStorage } from '@angular/fire/storage';

import { Article } from 'src/app/shared/interfaces/article.type';
import { ACTIVE } from 'src/app/shared/constants/status-constants';
import { STAFF } from 'src/app/shared/constants/member-constant';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BackofficeArticleService {
  articleCollection: string = 'articles';
  articleLikesCollection: string = 'likes';
  articleCommentsCollection: string = 'comments';
  articleImagePath: string = '/article';
  constructor(private afAuth: AngularFireAuth, private http: HttpClient, private db: AngularFirestore, private storage: AngularFireStorage, ) { }

  deleteArticle(articleId) {
    return this.http.delete(environment.baseAPIDomain + '/api/v1/articles/' + articleId);
  }

  getArticleById(articleId: string, authorId = null, type: string) {
    return new Promise<any>((resolve, reject) => {
      this.db.doc(`${this.articleCollection}/${articleId}`).valueChanges().subscribe((data) => {
        if (!authorId || data && data['author'].id === authorId || type == STAFF) {
          data['id'] = articleId;
          resolve(data)
        } else {
          reject('Unknown entity');
        }
      })
    })
  }
  updateArticleImage(articleId, imageDetails) {
    return new Promise<any>((resolve, reject) => {
      this.db.collection(`${this.articleCollection}`).doc(`${articleId}`).update(imageDetails).then(() => {
        resolve();
      })
    })
  }

  createArticle(article) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + '/api/v1/articles', article).subscribe((articleData) => {
        resolve(articleData)
      }, (error) => {
        reject(error)
      })
    })
  }
  updateArticle(articleId: string, articleDetails) {
    return new Promise((resolve, reject) => {
      return this.http.put(environment.baseAPIDomain + '/api/v1/articles/' + articleId, articleDetails).subscribe((articleData) => {
        resolve(articleData)
      }, (error) => {
        reject(error)
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
            this.updateArticle(articleId, { image: { url: imageUrl, alt: imageDetails.alt } }).then(res => resolve()).catch(err => reject(err))
          }).catch(err => reject(err))
        }).catch((error) => {
          console.log(error);
          reject();
        });

    })
  }
  uploadArticleFile(fileDetails: any) {
    const path = `${this.articleImagePath}/${Date.now()}_${fileDetails.name}`;
    return new Promise((resolve, reject) => {
      this.storage.upload(path, fileDetails).then(
        snapshot => {
          snapshot.ref.getDownloadURL().then((downloadURL) => {
            const imageUrl: string = downloadURL;
            resolve({ url: imageUrl, name: fileDetails.name })
          }).catch(err => reject(err))
        }).catch((error) => {
          console.log(error);
          reject();
        });

    })
  }

  getArticlesByUser(authorId, limit: number = 10, navigation: string = "first", lastVisible = null, type = null) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection<Article[]>(`${this.articleCollection}`, ref => ref
      .where("author.id", "==", authorId)
      .orderBy('created_at', 'desc')
      .limit(limit)
    )
    if (type) {
      dataQuery = this.db.collection<Article[]>(`${this.articleCollection}`, ref => ref
        .where('author.id', '==', authorId)
        .where('status', '==', ACTIVE)
        .where('type', '==', type)
        .orderBy('published_at', 'desc')

        .limit(limit)
      )
    }
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

  getAllArticles(authorId: string) {

    let dataQuery = this.db.collection<Article[]>(`${this.articleCollection}`, ref => ref
      .where("author.id", "==", authorId)
      .where('status', "==", ACTIVE)
      .orderBy('published_at', 'desc')
    )
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {

        const data: any = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })

    })
    );
  }
  deleteComment(articleId, commentId) {
    return this.http.delete(environment.baseAPIDomain + '/api/v1/articles/' + articleId + '/comments/' + commentId)
  }




}

