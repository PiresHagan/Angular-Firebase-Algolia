
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Article } from 'src/app/shared/interfaces/article.type';
import { AuthService } from 'src/app/shared/services/authentication.service';




@Injectable({
  providedIn: 'root'
})
export class CommonBackofficeService {
  articleCollection: string = 'articles';
  memberCollection: string = 'members';
  articleCommentsCollection: string = 'comments';
  sitesCollection: string = 'sites';
  constructor(private db: AngularFirestore, private http: HttpClient, private authService: AuthService) { }

  getArticles(limit: number = 10, navigation: string = "first", lastVisible = null) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection<Article[]>(`${this.articleCollection}`, ref => ref
      .orderBy('created_at', 'desc')
      .limit(limit)
    )
    switch (navigation) {
      case 'next':
        dataQuery = this.db.collection<Article[]>(`${this.articleCollection}`, ref => ref
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
  async updatePassword(email, password) {
    this.http.post(environment.baseAPIDomain + '/api/passwordChange', {
      email: email,
      password: password
    }).subscribe((data) => {
      // console.log(data)
    }, (err) => {
      // console.log(err)
    });

  }
  getMemberList(limit: number = 10, navigation: string = "first", lastVisible = null) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection(`${this.memberCollection}`, ref => ref
      .orderBy('updated_at', 'desc')
      .limit(limit)
    )
    switch (navigation) {
      case 'next':
        dataQuery = this.db.collection(`${this.memberCollection}`, ref => ref
          .orderBy('updated_at', 'desc')
          .limit(limit)
          .startAfter(lastVisible))
        break;
    }
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        memberList: actions.map(a => {

          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    })
    );
  }

  deleteMember(id) {
    return this.http.delete(environment.baseAPIDomain + '/api/v1/members/' + id);
  }

  getArticle(prop: string, value: string): Observable<Article[]> {
    return this.db.collection<Article>(`${this.articleCollection}`, ref =>
      ref.where(prop, "==", value)
    )
      .snapshotChanges()
      .pipe(
        take(1),
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getMember(prop: string, value: string) {
    return this.db.collection(`${this.memberCollection}`, ref =>
      ref.where(prop, "==", value)
    )
      .snapshotChanges()
      .pipe(
        take(1),
        map(actions => {
          return actions.map(a => {
            const data: any = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }
  deleteArticle(articleId) {
    return this.db.collection(this.articleCollection).doc(articleId).delete();
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

  getAdNetworkSites(limit: number = 25, navigation: string = "first", lastVisible = null) {
    if (!limit) {
      limit = 25;
    }
    let dataQuery = this.db.collectionGroup(`${this.sitesCollection}`, ref => ref
      .orderBy('created_at', 'desc')
      .orderBy('daily_traffic', 'desc')
      .limit(limit)
    )
    switch (navigation) {
      case 'next':
        dataQuery = this.db.collectionGroup(`${this.sitesCollection}`, ref => ref
          .orderBy('created_at', 'desc')
          .orderBy('daily_traffic', 'desc')
          .limit(limit)
          .startAfter(lastVisible))
        break;
    }
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        sitesList: actions.map(a => {

          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
        lastVisibleSites: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    })
    );
  }
  blockUser(id) {
    return this.http.patch(environment.baseAPIDomain + '/api/v1/members/' + id + '/block', {});
  }
  unBlockuser(id) {
    return this.http.patch(environment.baseAPIDomain + '/api/v1/members/' + id + '/unblock', {});
  }
}

