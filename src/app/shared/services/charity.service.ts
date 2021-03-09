import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Charity } from '../interfaces/charity.type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CharityService {

  private charitiesCollection = 'charities';
  private followersSubCollection = 'followers';
  private donationsSubCollection = 'donations';
  constructor(
    private http: HttpClient, 
    private db: AngularFirestore
  ) { }

  getAllCharities() {
    return this.db.collection<Charity[]>(this.charitiesCollection).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getOnBoardingCharities(lang: string) {
    return new Promise((resolve, reject) => {
      this.http.get(environment.baseAPIDomain + `/api/v1/onBoarding/${lang}/getTopCharities`, {}).subscribe((response: any) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }

  getCharityById(charityId: string): Observable<any> {
    return this.db.doc(`${this.charitiesCollection}/${charityId}`).valueChanges();
  }

  getCharityBySlug(slug: string) {
    return this.db.collection<Charity>(this.charitiesCollection, ref => ref
      .where('slug', '==', slug)
      .limit(1)
    ).snapshotChanges().pipe(take(1),
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  followCharity(charityId: string) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + `/api/v1/charities/${charityId}/follow`, {}).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }

  unfollowCharity(charityId: string) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + `/api/v1/charities/${charityId}/unfollow`, {}).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }

  isUserFollowing(charityId: string, followerId: string) {
    return this.db.collection(this.charitiesCollection).doc(charityId).collection(this.followersSubCollection).doc(followerId).valueChanges();
  }

  getCharitiesOnScroll(limit: number, navigation: string, lastVisible, lang: string) {
    let dataQuery = this.db.collection<Charity[]>(`${this.charitiesCollection}`, ref => ref
      .where("lang", "==", lang)
      .orderBy('created_at', 'desc')
      .limit(limit));
    
    if(navigation == 'next') {
      dataQuery = this.db.collection<Charity[]>(`${this.charitiesCollection}`, ref => ref
        .where("lang", "==", lang)
        .orderBy('created_at', 'desc')
        .limit(limit)
        .startAfter(lastVisible));
    }

    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        charityList: actions.map(a => {

          const data: any = a.payload.doc.data();
          return data;
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    }));
  }

  donate(data, charityId: string) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + `/api/v1/payment/charities/${charityId}/donates`, data).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }

  getFollowers(charityId, limit: number = 10, navigation: string = "first", lastVisible = null) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection(this.charitiesCollection).doc(charityId).collection(`${this.followersSubCollection}`, ref => ref
      .limit(limit)
    )
    switch (navigation) {
      case 'next':
        dataQuery = this.db.collection(this.charitiesCollection).doc(charityId).collection(`${this.followersSubCollection}`, ref => ref
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

}
