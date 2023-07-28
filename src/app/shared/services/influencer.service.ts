import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Category } from '../interfaces/category.type';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Infleuncer } from '../interfaces/infleuncer.type';

@Injectable({
  providedIn: 'root'
})
export class InfluencerService {
  categoriesCollection: string = 'influencer';
  infleuncerCollection: string = 'influencer';
  contactCollection: string = 'contactinfluencer';
  categoryDocument: string = 'category';
  funnelsCollection: string = 'funnels';
  topicsCollection: string = 'topics';

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private http: HttpClient
  ) { }

  getInfluencer(limit: number = 10, navigation: string = "first", lastVisible = null, type = null) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection<Infleuncer[]>(`${this.infleuncerCollection}`, ref => ref
      .orderBy('created_at', 'desc')
      .limit(limit)
    )
    switch (navigation) {
      case 'next':
        dataQuery = this.db.collection<Infleuncer[]>(`${this.infleuncerCollection}`, ref => ref
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
  getcontactbyUser(user) {
    let dataQuery = this.db.collectionGroup(`${this.contactCollection}`, ref => ref
      .where('user.slug','==',user)
      .orderBy('created_at', 'desc'));
      return dataQuery.snapshotChanges().pipe(map(actions => {
        return {
          serviceList: actions.map(a => {
            const parentId = a.payload.doc.ref.parent.parent?.id;
            const data: any = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data ,parentId};
          }),
        }
      })
      );

    
 
  }
  getInfluencerByCat( catigory = null, sercher = null,limit: number = 10, navigation: string = "first", lastVisible = null) {
    if (!limit) {
      limit = 10;
    }
    if (!sercher) {
      let dataQuery = this.db.collection<Infleuncer[]>(`${this.infleuncerCollection}`, ref => ref
        .where("category.slug", "==", catigory)
        .orderBy('created_at', 'desc')
        .limit(limit)
      )
      switch (navigation) {
        case 'next':
          dataQuery = this.db.collection<Infleuncer[]>(`${this.infleuncerCollection}`, ref => ref
            .where("category.slug", "==", catigory)
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
    else{
      let dataQuery = this.db.collection<Infleuncer[]>(`${this.infleuncerCollection}`, ref => ref
      .where("category.slug", "==", catigory)
      .where("title" , "==" , sercher)
      .orderBy('created_at', 'desc')
      .limit(limit)
    )
    switch (navigation) {
      case 'next':
        dataQuery = this.db.collection<Infleuncer[]>(`${this.infleuncerCollection}`, ref => ref
          .where("category.slug", "==", catigory)
          .where("title" , "==" , sercher)
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
  }

  getInfluencerserchtitle(title, limit: number = 10, navigation: string = "first", lastVisible = null, type = null) {
    console.log(title);
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection<Infleuncer[]>(`${this.infleuncerCollection}`, ref => ref
      .orderBy('created_at', 'desc').where('title', '==', title)
      .limit(limit)
    )
    switch (navigation) {
      case 'next':
        dataQuery = this.db.collection<Infleuncer[]>(`${this.infleuncerCollection}`, ref => ref
          .orderBy('created_at', 'desc').where('title', '==', title)
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


  submitURL(infulencerId, data) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + '/api/v1/influencer/submiturl/' + infulencerId, data).subscribe((response: any) => {
        resolve(response);

      }, (error) => {
        reject(error)
      })
    })
  }

  get(id: string): Observable<Category> {
    return this.db.doc<Category>(`${this.categoriesCollection}/${id}`).valueChanges().pipe(
      take(1),
      map(category => {
        category.id = id;
        return category
      })
    );
  }
  getCategoryBySlug(slug: string) {
    return this.db.collection<Category>(this.categoriesCollection, ref => ref
      .where('slug', '==', slug)
      .limit(1)
    ).snapshotChanges().pipe(take(1),
      map(actions => {
        const categoryData = actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
        return categoryData ? categoryData[0] : {}
      })
    );
  }
  getTopicBySlug(slug: string) {
    return this.db.collection<Category>(this.topicsCollection, ref => ref
      .where('slug', '==', slug)
      .limit(1)
    ).snapshotChanges().pipe(take(1),
      map(actions => {
        const categoryData = actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
        return categoryData ? categoryData[0] : {}
      })
    );
  }
  getTopicList(categoryId, language = 'en') {
    return this.db.collection<Category[]>(this.topicsCollection, ref => ref.where('lang', '==', language).where('category', '==', categoryId)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const uid = a.payload.doc.id;
          return { uid, ...data };
        });
      })
    );
  }

  addSubscription(category: Category, email: string) {
    const emailIdWithoutDot = email.split('.').join(''),
      contactObj = {
        email: email,
        timestamp: new Date().toISOString(),
        source: 'category',
        ...category
      };
    return new Promise((resolve, reject) => {
      this.db.doc(`${this.funnelsCollection}/${this.categoryDocument}/${category.id}/${emailIdWithoutDot}`).set(contactObj).then((articleData) => {
        resolve(articleData)
      })
    }).catch((error) => {
      // console.log(error)
    })
  }

  followCategory(userId: string, categoryId: string) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + `/api/v1/onBoarding/${userId}/followCategory`, {
        category_id: categoryId
      }).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }

  unfollowCategory(userId: string, categoryId: string) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + `/api/v1/onBoarding/${userId}/unFollowCategory`, {
        category_id: categoryId
      }).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }

  unfollowTopic(userId: string, topicId: string) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + `/api/v1/members/${userId}/unFollowTopic`, {
        topic_id: topicId
      }).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }

  followTopic(userId: string, topicId: string) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + `/api/v1/members/${userId}/followTopic`, {
        topic_id: topicId
      }).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }

  rateInfluencer(infulencerId,contactId, data){
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + '/api/v1/influencer/rateInfluencer/' + infulencerId + "/" + contactId, data).subscribe((response: any) => {
        resolve(response);

      }, (error) => {
        reject(error)
      })
    })
  }

}
