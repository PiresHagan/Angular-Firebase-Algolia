import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HairSalonType } from 'src/app/shared/interfaces/hair-salon.type';
import { take, map } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { HairSalonConstant } from 'src/app/shared/constants/hair-salon-constant';
import * as algoliasearch from 'algoliasearch/lite';
import { LanguageService } from './language.service';


@Injectable({
  providedIn: 'root'
})
export class HairSalonService {

  private subscriptionsCollection = 'subscriptions';
  private hairSalonCollection = 'hair-salon';
  private followersSubCollection = 'followers';
  private hairSalonLikesCollection: string = 'likes';
  private leadsCollection = "leads";
  private leadsPackageCollection = 'hair-salon-lead-packages';
  private publicProfilePackageCollection = "hair-salon-general-packages";
  private hairSalonServicesCollection = 'service';
  private hairSalonBookingCollection = 'booking';
  private basePath = '/hairSalon/';
  private searchClient = algoliasearch(
    environment.algolia.applicationId,
    environment.algolia.apiKey
  );
  private indexName = environment.algolia.index.hair_salon;
  private selectedLanguage: string = "";
  constructor(
    private http: HttpClient,
    private db: AngularFirestore,
    private language: LanguageService,
  ) {
    this.selectedLanguage = this.language.getSelectedLanguage();
    this.indexName = this.indexName + this.selectedLanguage;
  }

  getAllHairSalons(limit: number = 10, navigation: string = "first", lastVisible = null) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection<HairSalonType[]>(`${this.hairSalonCollection}`, ref => ref
      .orderBy('created_at', 'desc')
      .limit(limit)
    )
    switch (navigation) {
      case 'next':
        dataQuery = this.db.collection<HairSalonType[]>(`${this.hairSalonCollection}`, ref => ref
      .orderBy('created_at', 'desc')
          .limit(limit)
          .startAfter(lastVisible))
        break;
    }
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        hairSalonList: actions.map(a => {
          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    })
    );
  }

  getSimilarHairSalons(limit: number = 10, navigation: string = "first", lastVisible = null,
  hairSalonType: string){
    if (!limit) {
      limit = 10;
    }
    let dataQuery: AngularFirestoreCollection<unknown>;
    if(hairSalonType!=null){
      dataQuery = this.db.collection<HairSalonType[]>(`${this.hairSalonCollection}`, ref => ref
        .where('type', "==", hairSalonType)
        .orderBy('type', 'desc')
        .orderBy('created_at', 'desc')
        .limit(limit)
      )
      switch (navigation) {
        case 'next':
          dataQuery = this.db.collection<HairSalonType[]>(`${this.hairSalonCollection}`, ref => ref
          .where('type', "==", hairSalonType)
          .orderBy('type', 'desc')
          .orderBy('created_at', 'desc')
            .limit(limit)
            .startAfter(lastVisible))
          break;
      }
    }
    else {
      dataQuery = this.db.collection<HairSalonType[]>(`${this.hairSalonCollection}`, ref => ref
        .orderBy('created_at', 'desc')
        .limit(limit)
      )
      switch (navigation) {
        case 'next':
          dataQuery = this.db.collection<HairSalonType[]>(`${this.hairSalonCollection}`, ref => ref
          .orderBy('created_at', 'desc')
            .limit(limit)
            .startAfter(lastVisible))
          break;
      }
    }
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        hairSalonList: actions.map(a => {
          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    })
    );
  }

  async searchHairSalonsByAlgolia(limit: number = 10, navigation: string = "first", lastPage = null,
  searchNameValue : string){
    if (!limit) {
      limit = 10;
    }
    if (!lastPage) {
      lastPage = 0;
    }
    if(searchNameValue==null){
      searchNameValue ='';
    }
    var parameters = {
      hitsPerPage : limit,
      page:lastPage,
      query:`${searchNameValue}`,
      //filters: `name:"${searchNameValue}"`
    };
    const index = await this.searchClient.initIndex(this.indexName);
    const res:any = await index.search(parameters);
    return {
      hairSalonList: res.hits,
      lastPage: lastPage
    }
  }

  searchHairSalons(limit: number = 10, navigation: string = "first", lastVisible = null,
  searchNameValue : string,searchCountryValue: string,searchCityValue: string, searchServiceDeliverTypeValue:string, searchHairSalonTypeValue:string){
    if (!limit) {
      limit = 10;
    }
    let dataQuery: AngularFirestoreCollection<unknown>;
    if(searchCountryValue!=null && searchCityValue == null) {
      dataQuery = this.db.collection<HairSalonType[]>(`${this.hairSalonCollection}`, ref => ref
        .where('country', "==", searchCountryValue)
        .orderBy('country', 'desc')
        .orderBy('created_at', 'desc')
        .limit(limit)
      )
      switch (navigation) {
        case 'next':
          dataQuery = this.db.collection<HairSalonType[]>(`${this.hairSalonCollection}`, ref => ref
          .where('country', "==", searchCountryValue)
          .orderBy('country', 'desc')
          .orderBy('created_at', 'desc')
            .limit(limit)
            .startAfter(lastVisible))
          break;
      }
    }
    else if(searchCountryValue!=null && searchCityValue != null) {
      dataQuery = this.db.collection<HairSalonType[]>(`${this.hairSalonCollection}`, ref => ref
        .where('country', "==", searchCountryValue)
        .where('city', ">=", searchCityValue)
        .where('city', "<=", searchCityValue)
        .orderBy('city', 'desc')
        .orderBy('created_at', 'desc')
        .limit(limit)
      )
      switch (navigation) {
        case 'next':
          dataQuery = this.db.collection<HairSalonType[]>(`${this.hairSalonCollection}`, ref => ref
          .where('country', "==", searchCountryValue)
          .where('city', ">=", searchCityValue)
          .where('city', "<=", searchCityValue)
          .orderBy('city', 'desc')
          .orderBy('created_at', 'desc')
            .limit(limit)
            .startAfter(lastVisible))
          break;
      }
    }
    else if(searchCountryValue==null && searchCityValue != null) {
      dataQuery = this.db.collection<HairSalonType[]>(`${this.hairSalonCollection}`, ref => ref
        .where('city', ">=", searchCityValue)
        .where('city', "<=", searchCityValue)
        .orderBy('city', 'desc')
        .orderBy('created_at', 'desc')
        .limit(limit)
      )
      switch (navigation) {
        case 'next':
          dataQuery = this.db.collection<HairSalonType[]>(`${this.hairSalonCollection}`, ref => ref
          .where('city', ">=", searchCityValue)
          .where('city', "<=", searchCityValue)
          .orderBy('city', 'desc')
          .orderBy('created_at', 'desc')
            .limit(limit)
            .startAfter(lastVisible))
          break;
      }
    }
    else if(searchHairSalonTypeValue!=null) {
      dataQuery = this.db.collection<HairSalonType[]>(`${this.hairSalonCollection}`, ref => ref
        .where('type', "==", searchHairSalonTypeValue)
        .orderBy('created_at', 'desc')
        .limit(limit)
      )
      switch (navigation) {
        case 'next':
          dataQuery = this.db.collection<HairSalonType[]>(`${this.hairSalonCollection}`, ref => ref
          .where('type', "==", searchHairSalonTypeValue)
          .orderBy('created_at', 'desc')
            .limit(limit)
            .startAfter(lastVisible))
          break;
      }
    }
    else if(searchServiceDeliverTypeValue!=null) {
      dataQuery = this.db.collection<HairSalonType[]>(`${this.hairSalonCollection}`, ref => ref
        .where('deliver_services_type', "==", searchServiceDeliverTypeValue)
        .orderBy('created_at', 'desc')
        .limit(limit)
      )
      switch (navigation) {
        case 'next':
          dataQuery = this.db.collection<HairSalonType[]>(`${this.hairSalonCollection}`, ref => ref
          .where('deliver_services_type', "==", searchServiceDeliverTypeValue)
          .orderBy('created_at', 'desc')
            .limit(limit)
            .startAfter(lastVisible))
          break;
      }
    }
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        hairSalonList: actions.map(a => {
          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    })
    );
  }

  getOnBoardingHairSalons(lang: string) {
    return new Promise((resolve, reject) => {
      this.http.get(environment.baseAPIDomain + `/api/v1/onBoarding/${lang}/getTopHairSalons`, {}).subscribe((response: any) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }

  getHairSalonById(hairSalonId: string): Observable<any> {
    return this.db.doc(`${this.hairSalonCollection}/${hairSalonId}`).valueChanges();
  }

  getHairSalonBySlug(slug: string) {
    return this.db.collection<HairSalonType>(this.hairSalonCollection, ref => ref
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

  followHairSalon(hairSalonId: string) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + `/api/v1/hairSalon/${hairSalonId}/follow`, {}).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }

  unfollowHairSalon(hairSalonId: string) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + `/api/v1/hairSalon/${hairSalonId}/unfollow`, {}).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }

  createHairSalonLead(hairSalonId: string, leadData) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + `/api/v1/hairSalon/${hairSalonId}/leads`, leadData).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }

  isUserFollowing(hairSalonId: string, followerId: string) {
    return this.db.collection(this.hairSalonCollection).doc(hairSalonId).collection(this.followersSubCollection).doc(followerId).valueChanges();
  }

  getHairSalonsOnScroll(limit: number, navigation: string, lastVisible, lang: string) {
    let dataQuery = this.db.collection<HairSalonType[]>(`${this.hairSalonCollection}`, ref => ref
      .where("lang", "==", lang)
      .orderBy('created_at', 'desc')
      .limit(limit));

    if(navigation == 'next') {
      dataQuery = this.db.collection<HairSalonType[]>(`${this.hairSalonCollection}`, ref => ref
        .where("lang", "==", lang)
        .orderBy('created_at', 'desc')
        .limit(limit)
        .startAfter(lastVisible));
    }

    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        hairSalonList: actions.map(a => {

          const data: any = a.payload.doc.data();
          return data;
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    }));
  }
  like(hairSalonId: string, likerData) {
    return new Promise((resolve, reject) => {
      this.http.put(environment.baseAPIDomain + `/api/v1/hairSalon/${hairSalonId}/like`, likerData).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
    //return this.http.put(environment.baseAPIDomain + `/api/v1/hairSalon/${hairSalonId}/likes/like/${hairSalonId}`, likerData);
  }

  disLike(hairSalonId: string, likerData) {
    return new Promise((resolve, reject) => {
      this.http.put(environment.baseAPIDomain + `/api/v1/hairSalon/${hairSalonId}/dislike`, likerData).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
    //return this.http.put(environment.baseAPIDomain + `/api/v1/hairSalon/${hairSalonId}/likes/dislike/${hairSalonId}`, likerData);
  }

  isLikedByUser(hairSalonId: string, likerId) {
    return this.db.collection(this.hairSalonCollection).doc(hairSalonId).collection(this.hairSalonLikesCollection).doc(likerId).valueChanges();
  }

  updateViewCount(hairSalonId: string) {
    return new Promise((resolve, reject) => {
      this.http.put(environment.baseAPIDomain + `/api/v1/hairSalon/${hairSalonId}/viewed`, {}).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
    //return this.http.put(environment.baseAPIDomain + `/api/v1/hairSalon/${hairSalonId}/views/addView/${hairSalonId}`, viewData);
  }



  getAllFollowers(hairSalonId) {
    return this.db.collection(this.hairSalonCollection).doc(hairSalonId).collection(`${this.followersSubCollection}`)
      .snapshotChanges().pipe(map(actions => {
        return {
          followers: actions.map(a => {
            const data: any = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          }),
        }
      }));
  }

  getFollowers(hairSalonId, limit: number = 10, navigation: string = "first", lastVisible = null) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection(this.hairSalonCollection).doc(hairSalonId).collection(`${this.followersSubCollection}`, ref => ref
      .limit(limit)
    )
    switch (navigation) {
      case 'next':
        dataQuery = this.db.collection(this.hairSalonCollection).doc(hairSalonId).collection(`${this.followersSubCollection}`, ref => ref
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

  getHairSalonSubscription(hairSalonId: string) {
    let dataQuery = this.db.collection(`${this.subscriptionsCollection}`, ref => ref
      .where("customer_id", "==", hairSalonId)
      .where("status", "==", HairSalonConstant.STATUS_ACTIVE)
      .where("type", "==", HairSalonConstant.LEAD_PACKAGE)
    );
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data: any = a.payload.doc.data();
        return data;
      })
    }));
  }

  getHairSalonPublicProfileSubscription(hairSalonId: string) {
    let dataQuery = this.db.collection(`${this.subscriptionsCollection}`, ref => ref
      .where("customer_id", "==", hairSalonId)
      .where("status", "==", HairSalonConstant.STATUS_ACTIVE)
      .where("type", "==", HairSalonConstant.PUBLIC_PROFILE_PACKAGE)
    );
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data: any = a.payload.doc.data();
        return data;
      })
    }));
  }

  getHairSalonServices( hairSalonId: string ){
    return this.http.get(environment.baseAPIDomain + `/api/v1/hairSalon/${hairSalonId}/services`);
  }
  getHairSalonTimeSlot(hairSalonId: string, serviceId: string, data:any) {
    return this.http.post(environment.baseAPIDomain + `/api/v1/hairSalon/${hairSalonId}/services/${serviceId}/getTimeSlots`, data);
  }
  submitHairSalonBooking(hairSalonId: string, serviceId: string, data:any) {
    return this.http.post(environment.baseAPIDomain + `/api/v1/payment/hairSalon/${hairSalonId}/bookings/${serviceId}`, data);
  }
  updateHairSalonBookingStatus(hairSalonId: string, bookingId: string, data:any) {
    return this.http.put(environment.baseAPIDomain + `/api/v1/hairSalon/${hairSalonId}/booking/status/${bookingId}`, data);
  }
  updateHairSalonBookingPaymentStatus(hairSalonId: string, bookingId: string, data:any) {
    return this.http.put(environment.baseAPIDomain + `/api/v1/hairSalon/${hairSalonId}/booking/payment-status/${bookingId}`, data);
  }

}


