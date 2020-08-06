import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import 'firebase/storage';
import * as firebase from 'firebase/app'
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  authorsCollection: string = 'members';
  charitiesCollection: string = 'charities';
  companiesColection: string = 'companies';
  private followersCollection: string = 'followers';
  private followingsCollection: string = "followings";

  constructor(private afs: AngularFirestore, private http: HttpClient) { }

  getUserBySlug(slug: string) {
    return this.afs.collection(this.authorsCollection, ref =>
      ref.where("slug", "==", slug)
    ).snapshotChanges().pipe(map(actions => {
      return actions ? actions[0].payload.doc.data() : null;
    })
    );
  }
  getAuthorsById(authoIdArray: []) {
    return this.afs.collection(this.authorsCollection, ref =>
      ref.where("id", "in", authoIdArray.slice(0, 9))
    ).snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        return data;
      });
    })
    );

  }
  reportAbusedUser(userId: string) {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(`${this.authorsCollection}`).doc(`${userId}`).update({ is_abused: true }).then(() => {
        resolve();
      }).catch(() => {
        reject()
      })
    })
  }


  isUserFollowing(authorId: string, followerId: string, type: string = "author") {
    if (type == 'author')
      return this.afs.collection(this.authorsCollection).doc(authorId).collection(this.followersCollection).doc(followerId).valueChanges();
    else if (type == 'company') {
      return this.afs.collection(this.companiesColection).doc(authorId).collection(this.followersCollection).doc(followerId).valueChanges();
    }
    else if (type == 'charity') {
      return this.afs.collection(this.charitiesCollection).doc(authorId).collection(this.followersCollection).doc(followerId).valueChanges();
    }
  }

  getFollowers(authorId) {
    return this.afs.collection(this.authorsCollection).doc(authorId).collection(this.followersCollection).valueChanges()
  }

  getFollowings(authorId) {
    return this.afs.collection(this.authorsCollection).doc(authorId).collection(this.followingsCollection).valueChanges()
  }

  getFollowings_new(authorId, limit: number = 10, navigation: string = "first", lastVisible = null) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.afs.collection(this.authorsCollection).doc(authorId).collection(`${this.followingsCollection}`, ref => ref
      .limit(limit)
    )
    switch (navigation) {
      case 'next':
        dataQuery = this.afs.collection(this.authorsCollection).doc(authorId).collection(`${this.followingsCollection}`, ref => ref
          //  .orderBy('published_on', 'desc')
          .limit(limit)
          .startAfter(lastVisible))
        break;
    }
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        followings: actions.map(a => {

          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    })
    );
  }

  getAuthors(lang: string = 'en', limit: number = 10) {
    return this.afs.collection(this.authorsCollection, ref =>
      ref.limit(limit)
        .where('type', "==", 'author')
        .where('lang', "==", lang)
        .orderBy('followers_count', 'desc')
    ).snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        return data;
      });
    })
    );

  }


  getFollowers_new(authorId, limit: number = 10, navigation: string = "first", lastVisible = null) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.afs.collection(this.authorsCollection).doc(authorId).collection(`${this.followersCollection}`, ref => ref
      .limit(limit)
    )
    switch (navigation) {
      case 'next':
        dataQuery = this.afs.collection(this.authorsCollection).doc(authorId).collection(`${this.followersCollection}`, ref => ref
          //  .orderBy('published_on', 'desc')
          .limit(limit)
          .startAfter(lastVisible))
        break;
    }
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        followers: actions.map(a => {

          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    })
    );
  }

  follow(authorId: string, type: string = 'author') {
    if (type == 'author')
      return this.http.post(environment.baseAPIDomain + `/api/v1/members/${authorId}/follow`, {}).subscribe();
    else if (type == 'company') {
      return this.http.post(environment.baseAPIDomain + `/api/v1/companies/${authorId}/follow`, {}).subscribe();
    }
    else if (type == 'charity') {
      return this.http.post(environment.baseAPIDomain + `/api/v1/charities/${authorId}/follow`, {}).subscribe();
    }

  }

  unfollow(authorId: string, type: string = 'author') {
    if (type == 'author')
      return this.http.post(environment.baseAPIDomain + `/api/v1/members/${authorId}/unfollow`, {}).subscribe();
    else if (type == 'company') {
      return this.http.post(environment.baseAPIDomain + `/api/v1/companies/${authorId}/unfollow`, {}).subscribe();
    }
    else if (type == 'charity') {
      return this.http.post(environment.baseAPIDomain + `/api/v1/charities/${authorId}/unfollow`, {}).subscribe();
    }

  }

}