import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, mergeAll, take } from 'rxjs/operators';
import { Service } from '../interfaces/service.type';
import { AngularFireStorage } from '@angular/fire/storage';
import { ACTIVE, DRAFT } from '../constants/status-constants';
import * as firebase from 'firebase/app';
import * as moment from 'moment';
import { STAFF } from '../constants/member-constant';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Contact } from '../interfaces/contact.type';
import { combineLatest } from 'rxjs-compat/operator/combineLatest';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  serviceCollection: string = 'services';
  serviceLikesCollection: string = 'likes';
  serviceCommentsCollection: string = 'comments';
  serviceImagePath: string = '/service';
  constructor(private afAuth: AngularFireAuth,
    private db: AngularFirestore, private storage: AngularFireStorage, private http: HttpClient) { }

  getAll() {
    return this.db.collection<Service[]>(this.serviceCollection, ref => ref
      .limit(2)
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

  getServices(limit: number = 10, navigation: string = "first", lastVisible = null, categorySlug: string = null, lang: string = 'en') {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection<Service[]>(`${this.serviceCollection}`, ref => ref
      .where('lang', "==", lang)
      .where('status', "==", ACTIVE)
      .orderBy('published_at', 'desc')
      .limit(limit)
    )
    if (categorySlug) {
      if (categorySlug.split(" ")[0] != "subcategory")
        dataQuery = this.db.collection<Service[]>(`${this.serviceCollection}`, ref => ref
          .where("category.slug", "==", categorySlug)
          .where('lang', "==", lang)
          .where('status', "==", ACTIVE)
          .orderBy('published_at', 'desc')
          .limit(limit)
        )
      else {
        dataQuery = this.db.collection<Service[]>(`${this.serviceCollection}`, ref => ref
          .where("topic_list", "array-contains-any", [categorySlug.substring(12)])
          .where('lang', "==", lang)
          .where('status', "==", ACTIVE)
          .orderBy('published_at', 'desc')
          .limit(limit)
        )
      }
    }

    switch (navigation) {
      case 'next':
        if (categorySlug)
          if (categorySlug.split[0] != "subcategory")
            dataQuery = this.db.collection<Service[]>(`${this.serviceCollection}`, ref => ref
              .where("category.slug", "==", categorySlug)
              .where('lang', "==", lang)
              .where('status', "==", ACTIVE)
              .orderBy('published_at', 'desc')
              .limit(limit)
              .startAfter(lastVisible))
          else {
            dataQuery = this.db.collection<Service[]>(`${this.serviceCollection}`, ref => ref
              .where("topic_list", "array-contains-any", [categorySlug.substring(10)])
              .where('lang', "==", lang)
              .where('status', "==", ACTIVE)
              .orderBy('published_at', 'desc')
              .limit(limit)
              .startAfter(lastVisible))
            break;
          }
        else
          dataQuery = this.db.collection<Service[]>(`${this.serviceCollection}`, ref => ref
            .where('lang', "==", lang)
            .where('status', "==", ACTIVE)
            .orderBy('published_at', 'desc')
            .limit(limit)
            .startAfter(lastVisible))
        break;
    }
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        serviceList: actions.map(a => {

          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    })
    );
  }


  getServicessub(limit: number = 10, navigation: string = "first", lastVisible = null, categorySlug: string = null, lang: string = 'en') {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection<Service[]>(`${this.serviceCollection}`, ref => ref
      .where('lang', "==", lang)
      .where('status', "==", ACTIVE)
      .orderBy('published_at', 'desc')
      .limit(limit)
    )
    if (categorySlug) {
      dataQuery = this.db.collection<Service[]>(`${this.serviceCollection}`, ref => ref
        .where("topic_list", "array-contains-any", [categorySlug])
        .where('lang', "==", lang)
        .where('status', "==", ACTIVE)
        .orderBy('published_at', 'desc')
        .limit(limit)
      )
    }

    switch (navigation) {
      case 'next':
        if (categorySlug)
          dataQuery = this.db.collection<Service[]>(`${this.serviceCollection}`, ref => ref
            .where("topic_list", "array-contains-any", [categorySlug])
            .where('lang', "==", lang)
            .where('status', "==", ACTIVE)
            .orderBy('published_at', 'desc')
            .limit(limit)
            .startAfter(lastVisible))
        else
          dataQuery = this.db.collection<Service[]>(`${this.serviceCollection}`, ref => ref
            .where('lang', "==", lang)
            .where('status', "==", ACTIVE)
            .orderBy('published_at', 'desc')
            .limit(limit)
            .startAfter(lastVisible))
        break;
    }
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        serviceList: actions.map(a => {

          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    })
    );
  }

  getService(slug: string, addRef?: boolean) {
    return this.db.collection<Service>(this.serviceCollection, ref => ref
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
          return { id, ...data, __doc: addRef ? a.payload.doc : undefined };
        });
      })
    );
  }
  getServicessearch(limit: number = 10, navigation: string = "first", lastVisible = null, categorySlug: string = null, lang: string = 'en', searchValue: string, searchfield) {
    if (!limit) {
      limit = 10;
    }
    searchValue = searchValue == null ? undefined : searchValue;
    let dataQuery1 = this.db.collection<Service[]>(`${this.serviceCollection}`, ref => ref
      .where(searchfield, ">=", searchValue)
      .where(searchfield, "<=", searchValue + '\uf8ff')
      .where('lang', "==", lang)
      .where('status', "==", ACTIVE)
      .orderBy(searchfield, 'desc')
      .orderBy('published_at', 'desc')
      .limit(limit)
    )
    if (categorySlug) {
      dataQuery1 = this.db.collection<Service[]>(`${this.serviceCollection}`, ref => ref
        .where(searchfield, ">=", searchValue)
        .where(searchfield, "<=", searchValue + '\uf8ff')
        .where("category.slug", "==", categorySlug)
        .where('lang', "==", lang)
        .where('status', "==", ACTIVE)
        .orderBy(searchfield, 'desc')
        .orderBy('published_at', 'desc')
        .limit(limit)
      )
    }

    switch (navigation) {
      case 'next':
        if (categorySlug) {
          dataQuery1 = this.db.collection<Service[]>(`${this.serviceCollection}`, ref => ref
            .where("category.slug", "==", categorySlug)
            .where(searchfield, ">=", searchValue)
            .where('lang', "==", lang)
            .where('status', "==", ACTIVE)
            .orderBy('published_at', 'desc')
            .limit(limit)
            .startAfter(lastVisible))
        }
        else {
          dataQuery1 = this.db.collection<Service[]>(`${this.serviceCollection}`, ref => ref
            .where('lang', "==", lang)
            .where(searchfield, ">=", searchValue)
            .where('status', "==", ACTIVE)
            .orderBy('published_at', 'desc')
            .limit(limit)
            .startAfter(lastVisible))
          break;
        }
    }

    return dataQuery1.snapshotChanges().pipe(map(actions => {
      return {
        serviceList: actions.map(a => {

          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data }
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    })
    );

  }





  getServiceLikes(serviceId: string) {
    return this.db.collection(this.serviceLikesCollection, ref => ref
      .where('fields.service', '==', serviceId)
    ).snapshotChanges().pipe(map(actions => {
      return actions.length;
    })
    );
  }
  /**
   * Get comments according service id 
   * @param serviceId 
   * @param limit 
   */




  createContact(serviceId: string, contact: Contact) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + '/api/v1/myservices/' + serviceId + "/contact", contact).subscribe((serviceData) => {
        resolve(serviceData)
      }, (error) => {
        reject(error)
      })
    })


  }

  /**
   * Update existing comment.
   * 
   * @param serviceId 
   * @param commentid 
   * @param commentDtails 
   */



  getCategoryRow(slug: string, lang: string = 'en', limit: number, afterId?: string) {
    const startAfter = afterId
      ? this.getService(afterId, true).pipe(map(a => a[0].__doc))
      : of(null);

    return startAfter.pipe(
      map(__doc => {
        return this.db.collection<Service[]>(this.serviceCollection, refV => {
          let ref = refV
            .where('category.slug', '==', slug)
            .where('lang', '==', lang)
            .where('status', "==", ACTIVE)
            .limit(limit);

          if (__doc) ref = ref.startAfter(__doc);
          return ref;
        }
        ).snapshotChanges();
      }),
      mergeAll(),
      map((actions) => {
        const res = actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });

        return res;
      })
    );
  }


  getCategory(slug: string, lang: string = 'en') {
    return this.db.collection<Service[]>(this.serviceCollection, ref => ref
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







  getServicesByAuthor(authorId: string, limit: number = 10, navigation: string = "first", lastVisible = null, type = null) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection<Service[]>(`${this.serviceCollection}`, ref => ref
      .where("author.id", "==", authorId)
      .where('status', "==", ACTIVE)
      .orderBy('published_at', 'desc')
      .limit(limit)
    )
    if (type) {
      dataQuery = this.db.collection<Service[]>(`${this.serviceCollection}`, ref => ref
        .where("author.id", "==", authorId)
        .where('status', "==", ACTIVE)
        .where('type', "==", type)
        .orderBy('published_at', 'desc')

        .limit(limit)
      )
    }
    switch (navigation) {
      case 'next':
        dataQuery = this.db.collection<Service[]>(`${this.serviceCollection}`, ref => ref
          .where("author.id", "==", authorId)
          .where('status', "==", ACTIVE)
          .orderBy('published_at', 'desc')
          .limit(limit)
          .startAfter(lastVisible))
        if (type) {
          dataQuery = this.db.collection<Service[]>(`${this.serviceCollection}`, ref => ref
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
        serviceList: actions.map(a => {

          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    })
    );
  }




  getServicesByUser(authorId, limit: number = 10, navigation: string = "first", lastVisible = null) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection<Service[]>(`${this.serviceCollection}`, ref => ref
      .where("author.id", "==", authorId)
      .orderBy('created_at', 'desc')
      .limit(limit)
    )
    switch (navigation) {
      case 'next':
        dataQuery = this.db.collection<Service[]>(`${this.serviceCollection}`, ref => ref
          .where("author.id", "==", authorId)
          .orderBy('created_at', 'desc')
          .limit(limit)
          .startAfter(lastVisible))
        break;
    }
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        serviceList: actions.map(a => {

          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    })
    );
  }


  getServicesBySlug(limit: number = 10, navigation: string = "first", lastVisible = null, categorySlug: string = null, topicSlug: string = '', lang: string = 'en') {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection<Service[]>(`${this.serviceCollection}`, ref => ref
      .where("category.slug", "==", categorySlug)
      .where("lang", "==", lang)
      .where('status', "==", ACTIVE)
      .orderBy('published_at', 'desc')
      .limit(limit))
    if (topicSlug) {
      dataQuery = this.db.collection<Service[]>(`${this.serviceCollection}`, ref => ref
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
          dataQuery = this.db.collection<Service[]>(`${this.serviceCollection}`, ref => ref
            .where("category.slug", "==", categorySlug)
            .where("lang", "==", lang)
            .where('status', "==", ACTIVE)
            .where("topics_list", "array-contains-any", [topicSlug])
            .orderBy('published_at', 'desc')
            .limit(limit)
            .startAfter(lastVisible))
        else
          dataQuery = this.db.collection<Service[]>(`${this.serviceCollection}`, ref => ref
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
        serviceList: actions.map(a => {

          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    })
    );
  }

  updateServiceAbuse(serviceId: string) {
    return new Promise<any>((resolve, reject) => {
      this.db.collection(`${this.serviceCollection}`).doc(`${serviceId}`).update({ is_abused: true }).then(() => {
        resolve();
      })
    })
  }





  like(serviceId: string, likerData) {
    var likes = { like: true };
    this.likeCount(serviceId);
    return new Promise<any>((resolve, reject) => {
      this.db.collection(`services/${serviceId}/likes`).doc(likerData.id).set(likes).then(() => {
        resolve();
      })
    });


  }

  disLike(serviceId: string, likerData) {
    this.disLikeCount(serviceId);
    return new Promise<any>((resolve, reject) => {
      this.db.collection(`services/${serviceId}/likes`).doc(likerData).delete().then(() => {
        resolve();
      })
    });


  }


  isLikedByUser(serviceId: string, likerId) {
    return this.db.collection(this.serviceCollection).doc(serviceId).collection(this.serviceLikesCollection).doc(likerId).valueChanges();
  }

  getServiceById(serviceId: string, authorId, type: string) {
    return new Promise<any>((resolve, reject) => {
      this.db.doc(`${this.serviceCollection}/${serviceId}`).valueChanges().subscribe((data) => {
        if (data && data['author'].id === authorId || type == STAFF) {
          data['id'] = serviceId;
          resolve(data)
        } else {
          reject('Unknown entity');
        }
      })
    })
  }

  updateViewCount(serviceId: string) {
    const db = firebase.default.firestore();
    const increment = firebase.default.firestore.FieldValue.increment(1);
    const serviceRef = db.collection(this.serviceCollection).doc(serviceId);
    serviceRef.update({ view_count: increment })
  }
  likeCount(serviceId: string) {
    const db = firebase.default.firestore();
    const increment = firebase.default.firestore.FieldValue.increment(1);
    const serviceRef = db.collection(this.serviceCollection).doc(serviceId);
    serviceRef.update({ likes_count: increment })
  }
  disLikeCount(serviceId: string) {
    const db = firebase.default.firestore();
    const increment = firebase.default.firestore.FieldValue.increment(-1);
    const serviceRef = db.collection(this.serviceCollection).doc(serviceId);
    serviceRef.update({ likes_count: increment })
  }
  deleteService(serviceId) {
    return this.db.collection(this.serviceCollection).doc(serviceId).delete();
  }

}

