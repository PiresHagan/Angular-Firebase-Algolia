import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Fundraiser } from '../interfaces/fundraiser.type';
import { ACTIVE } from '../constants/status-constants';

@Injectable({
  providedIn: 'root'
})

export class FundraiserService {

  private fundraisersCollection = 'fundraisings';
  private followersSubCollection = 'followers';
  constructor(
    private http: HttpClient, 
    private db: AngularFirestore
  ) { }

  getAllFundraisers() {
    return this.db.collection<Fundraiser[]>(this.fundraisersCollection).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  } 

  isUserFollowing(fundraiserId: string, followerId: string) {
    return this.db.collection(this.fundraisersCollection).doc(fundraiserId).collection(this.followersSubCollection).doc(followerId).valueChanges();
  }

  followFundraiser(fundraiserId: string) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + `/api/v1/fundraisings/${fundraiserId}/follow`, {}).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }

  unfollowFundraiser(fundraiserId: string) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + `/api/v1/fundraisings/${fundraiserId}/unfollow`, {}).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }

  getFundraiserBySlug(slug: string) {
    return this.db.collection<Fundraiser>(this.fundraisersCollection, ref => ref.where('slug', '==', slug).limit(1)).valueChanges()
  }

  getFundraisersOnScroll(limit: number, navigation: string, lastVisible, lang: string) {
    let dataQuery = this.db.collection<Fundraiser[]>(`${this.fundraisersCollection}`, ref => ref
      .where("lang", "==", lang)
      .where('status', "==", ACTIVE)
      .orderBy('published_at', 'desc')
      .limit(limit));
    
    if(navigation == 'next') {
      dataQuery = this.db.collection<Fundraiser[]>(`${this.fundraisersCollection}`, ref => ref
        .where("lang", "==", lang)
        .where('status', "==", ACTIVE)
        .orderBy('published_at', 'desc')
        .limit(limit)
        .startAfter(lastVisible));
    }

    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        fundraiserList: actions.map(a => {

          const data: any = a.payload.doc.data();
          return data;
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    }));
  }

  donate(data, fundraiserId: string) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + `/api/v1/payment/fundraisings/${fundraiserId}/donates`, data).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }

}
