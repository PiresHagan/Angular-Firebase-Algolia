import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import 'firebase/storage';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { STAFF, AUTHOR, MEMBER, COMPANY, CHARITY, FUNDRAISER } from '../constants/member-constant';



@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  authorsCollection: string = 'members';
  charitiesCollection: string = 'charities';
  companiesColection: string = 'companies';
  fundraisersCollection = 'fundraisings';
  private followersCollection: string = 'followers';
  private followingsCollection: string = 'followings';

  constructor(private afs: AngularFirestore, private http: HttpClient) { }

  getUserBySlug(slug: string) {
    return this.afs.collection(this.authorsCollection, ref =>
      ref.where('slug', '==', slug)
    ).snapshotChanges().pipe(map(actions => {
      return actions ? actions[0].payload.doc.data() : null;
    }));
  }
  getAuthorsById(authoIdArray: []) {
    return this.afs.collection(this.authorsCollection, ref =>
      ref.where('id', 'in', authoIdArray.slice(0, 9))
    ).snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        return data;
      });
    })
    );

  }

  getOnBoardingContributors(lang: string) {
    return new Promise((resolve, reject) => {
      this.http.get(environment.baseAPIDomain + `/api/v1/onBoarding/${lang}/getTopContributors`, {}).subscribe((response: any) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }

  reportAbusedUser(userId: string) {
    return new Promise<any>((resolve, reject) => {
      return this.http.post(environment.baseAPIDomain + `/api/v1/members/${userId}/abuse`, {}).subscribe(() => {
        resolve();
      }, err => {
        reject();
        // console.log(err);
      });
    })
  }


  isUserFollowing(authorId: string, followerId: string, type: string = null) {
    if (!type || type == STAFF || type == AUTHOR || type == MEMBER)
      return this.afs.collection(this.authorsCollection).doc(authorId).collection(this.followersCollection).doc(followerId).valueChanges();
    else if (type == COMPANY) {
      return this.afs.collection(this.companiesColection).doc(authorId).collection(this.followersCollection).doc(followerId).valueChanges();
    }
    else if (type == CHARITY) {
      return this.afs.collection(this.charitiesCollection).doc(authorId).collection(this.followersCollection).doc(followerId).valueChanges();
    }
    else if (type == FUNDRAISER) {
      return this.afs.collection(this.fundraisersCollection).doc(authorId).collection(this.followersCollection).doc(followerId).valueChanges();
    }
  }

  getAllFollowersByAuthorType(authorId: string, type: string) {
    if (!type || type == STAFF || type == AUTHOR || type == MEMBER)
      return this.afs.collection(this.authorsCollection).doc(authorId).collection(this.followersCollection).valueChanges();
    else if (type == COMPANY) {
      return this.afs.collection(this.companiesColection).doc(authorId).collection(this.followersCollection).valueChanges();
    }
    else if (type == CHARITY) {
      return this.afs.collection(this.charitiesCollection).doc(authorId).collection(this.followersCollection).valueChanges();
    }
    else if (type == FUNDRAISER) {
      return this.afs.collection(this.fundraisersCollection).doc(authorId).collection(this.followersCollection).valueChanges();
    }
  }

  getFollowers(authorId) {
    return this.afs.collection(this.authorsCollection).doc(authorId).collection(this.followersCollection).valueChanges()
  }

  getFollowings(authorId) {
    return this.afs.collection(this.authorsCollection).doc(authorId).collection(this.followingsCollection).valueChanges()
  }

  getFollowings_new(authorId, limit: number = 10, navigation: string = 'first', lastVisible = null) {
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
        .where('type', '==', 'author')
        .where('lang', '==', lang)
        .orderBy('followers_count', 'desc')
    ).snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        return data;
      });
    })
    );

  }


  getFollowers_new(authorId, limit: number = 10, navigation: string = 'first', lastVisible = null) {
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

  follow(authorId: string, type: string = null, followerData = { 'newsletter_time': 'alltime' }) {
    if (!type || type == STAFF || type == AUTHOR || type == MEMBER)
      return this.http.post(environment.baseAPIDomain + `/api/v1/members/${authorId}/follow`, followerData).subscribe();
    else if (type == COMPANY) {
      return this.http.post(environment.baseAPIDomain + `/api/v1/companies/${authorId}/follow`, followerData).subscribe();
    }
    else if (type == CHARITY) {
      return this.http.post(environment.baseAPIDomain + `/api/v1/charities/${authorId}/follow`, followerData).subscribe();
    }
    else if (type == FUNDRAISER) {
      return this.http.post(environment.baseAPIDomain + `/api/v1/fundraisings/${authorId}/follow`, followerData).subscribe();
    }

  }

  unfollow(authorId: string, type: string = null) {
    if (!type || type == STAFF || type == AUTHOR || type == MEMBER)
      return this.http.post(environment.baseAPIDomain + `/api/v1/members/${authorId}/unfollow`, {}).subscribe();
    else if (type == COMPANY) {
      return this.http.post(environment.baseAPIDomain + `/api/v1/companies/${authorId}/unfollow`, {}).subscribe();
    }
    else if (type == CHARITY) {
      return this.http.post(environment.baseAPIDomain + `/api/v1/charities/${authorId}/unfollow`, {}).subscribe();
    }
    else if (type == FUNDRAISER) {
      return this.http.post(environment.baseAPIDomain + `/api/v1/fundraisings/${authorId}/unfollow`, {}).subscribe();
    }
  }

  getAuthorTypeById(authorId: string) {
    return this.afs.collection(this.authorsCollection, ref =>
      ref.where('id', '==', authorId)
    ).snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        return data;
      });
    })
    );
  }

}