import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase/app';

import { Fundraiser } from 'src/app/shared/interfaces/fundraiser.type';
import { ACTIVE } from 'src/app/shared/constants/status-constants';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class BackofficeFundraiserService {

  fundraiserCollection: string = 'fundraisings';
  fundraiserImagePath: string = '/fundraiser';
  fundraiserDonation = "donates";
  
  constructor(private http: HttpClient, private db: AngularFirestore, private storage: AngularFireStorage, ) { }

  deleteFundraiser(fundraiserId) {
    return this.http.delete(environment.baseAPIDomain + '/api/v1/fundraisings/' + fundraiserId);
  }

  getFundraiserById(fundraiserId: string) {
    return new Promise<any>((resolve, reject) => {
      this.db.doc(`${this.fundraiserCollection}/${fundraiserId}`).valueChanges().subscribe((data) => {
        if (data) {
          data['id'] = fundraiserId;
          resolve(data)
        } else {
          reject('Unknown entity');
        }
      })
    })
  }

  updateFundraiserImage(fundraiserId, imageDetails) {
    return new Promise<any>((resolve, reject) => {
      this.db.collection(`${this.fundraiserCollection}`).doc(`${fundraiserId}`).update(imageDetails).then(() => {
        resolve();
      })
    })
  }

  createFundraiser(fundraiser) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + '/api/v1/fundraisings', fundraiser).subscribe((fundraiserData) => {
        resolve(fundraiserData)
      }, (error) => {
        reject(error)
      })
    })
  }

  updateFundraiser(fundraiserId: string, fundraiserDetails) {
    return new Promise((resolve, reject) => {
      return this.http.put(environment.baseAPIDomain + '/api/v1/fundraisings/' + fundraiserId, fundraiserDetails).subscribe((fundraiserData) => {
        resolve(fundraiserData)
      }, (error) => {
        reject(error)
      })
    })
  }

  addFundraiserImage(fundraiserId: string, imageDetails: any) {
    const path = `${this.fundraiserImagePath}/${Date.now()}_${imageDetails.file.name}`;
    return new Promise((resolve, reject) => {
      this.storage.upload(path, imageDetails.file).then( snapshot => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          const imageUrl: string = downloadURL;
          this.updateFundraiser(fundraiserId, { image: { url: imageUrl, alt: imageDetails.alt } }).then(res => resolve()).catch(err => reject(err))
        }).catch(err => reject(err))
      }).catch((error) => {
        console.log(error);
        reject();
      });
    })
  }

  uploadFundraiserFile(fileDetails: any) {
    const path = `${this.fundraiserImagePath}/${Date.now()}_${fileDetails.name}`;
    return new Promise((resolve, reject) => {
      this.storage.upload(path, fileDetails).then( snapshot => {
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

  getFundraisersByUser(authorId, limit: number = 10, navigation: string = "first", lastVisible = null) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection<Fundraiser[]>(`${this.fundraiserCollection}`, ref => ref
      .where("author.id", "==", authorId)
      .orderBy('created_at', 'desc')
      .limit(limit)
    )
    switch (navigation) {
      case 'next':
        dataQuery = this.db.collection<Fundraiser[]>(`${this.fundraiserCollection}`, ref => ref
          .where("author.id", "==", authorId)
          .orderBy('created_at', 'desc')
          .limit(limit)
          .startAfter(lastVisible))
        break;
    }
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        fundraiserList: actions.map(a => {

          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    }));
  }

  getFundraisersBySlug(limit: number = 10, navigation: string = "first", lastVisible = null, lang: string = 'en') {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection<Fundraiser[]>(`${this.fundraiserCollection}`, ref => ref
      .where("lang", "==", lang)
      .where('status', "==", ACTIVE)
      .orderBy('published_at', 'desc')
      .limit(limit));

    switch (navigation) {
      case 'next':
        dataQuery = this.db.collection<Fundraiser[]>(`${this.fundraiserCollection}`, ref => ref
          .where("lang", "==", lang)
          .where('status', "==", ACTIVE)
          .orderBy('published_at', 'desc')
          .limit(limit)
          .startAfter(lastVisible))
        break;
    }
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        fundraiserList: actions.map(a => {

          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    }));
  }


  getFundraisers(authorId, limit: number = 10, navigation: string = "first", lastVisible = null) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection<Fundraiser[]>(`${this.fundraiserCollection}`, ref => ref
      .where("author.id", "==", authorId)
      .where('status', "==", ACTIVE)
      .orderBy('published_at', 'desc')
      .limit(limit)
    )
    switch (navigation) {
      case 'next':
        dataQuery = this.db.collection<Fundraiser[]>(`${this.fundraiserCollection}`, ref => ref
          .where("author.id", "==", authorId)
          .where('status', "==", ACTIVE)
          .limit(limit)
          .startAfter(lastVisible))
        break;
    }
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        fundraiserList: actions.map(a => {

          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    }));
  }

  getFundraisersByAuthor(authorId: string, limit: number = 10, navigation: string = "first", lastVisible = null) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection<Fundraiser[]>(`${this.fundraiserCollection}`, ref => ref
      .where("author.id", "==", authorId)
      .where('status', "==", ACTIVE)
      .orderBy('published_at', 'desc')
      .limit(limit)
    )
    switch (navigation) {
      case 'next':
        dataQuery = this.db.collection<Fundraiser[]>(`${this.fundraiserCollection}`, ref => ref
          .where("author.id", "==", authorId)
          .where('status', "==", ACTIVE)
          .orderBy('published_at', 'desc')
          .limit(limit)
          .startAfter(lastVisible))
        break;
    }
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        fundraiserList: actions.map(a => {
          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    })
    );
  }

  getFundraiser(slug: string) {
    return this.db.collection<Fundraiser>(this.fundraiserCollection, ref => ref
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

  getAllFundraisers(authorId: string) {
    let dataQuery = this.db.collection<Fundraiser[]>(`${this.fundraiserCollection}`, ref => ref
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
    }));
  }

  getDonation(fundraiserId, limit: number = 10, navigation: string = "first", lastVisible = null) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection(this.fundraiserCollection).doc(fundraiserId).collection(`${this.fundraiserDonation}`, ref => ref)
    switch (navigation) {
      case 'next':
        dataQuery = this.db.collection(this.fundraiserCollection).doc(fundraiserId).collection(`${this.fundraiserDonation}`, ref => ref
          .orderBy('created_at', 'desc')
          .startAfter(lastVisible))
        break;
    }
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        donations: actions.map(a => {

          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    })
    );
  }

  addImage(file: string, fileName: string) {
    return new Promise((resolve, reject) => {
      firebase.storage().ref(`${this.fundraiserImagePath}/${fileName}`).putString(file, "data_url").then( snapshot => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          const imageUrl: string = downloadURL;
          resolve({ url: downloadURL, alt: fileName });
        }).catch(err => reject(err))
      }).catch((error) => {
        console.log(error);
        reject();
      });
    })
  }

  setupConnectedAccount(fundraiserId: string) {
    return this.http.post(environment.baseAPIDomain + `/api/v1/payment/sessions/fundraisings/${fundraiserId}/connectedAccount`, {
      redirectUrl: window && window.location && window.location.href || '',
      refreshUrl: window && window.location && window.location.href || ''
    })
  }

}

