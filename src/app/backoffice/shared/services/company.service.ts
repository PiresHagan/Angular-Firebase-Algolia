import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from 'src/app/shared/interfaces/company.type';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private basePath = '/companies/';
  private companyCollection = 'companies'
  private followersCollection = "followers"
  constructor(private http: HttpClient,
    public db: AngularFirestore) {

  }

  addImage(file: string, fileName: string) {
    return new Promise((resolve, reject) => {
      firebase.storage().ref(`${this.basePath}/${fileName}`).putString(file, "data_url").then(
        snapshot => {
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

  addCompany(postData) {
    const apicall = environment.baseAPIDomain + '/api/v1/companies';
    return this.http.post(apicall, postData)

  }
  updateCompany(postData, companyId) {
    const apicall = environment.baseAPIDomain + '/api/v1/companies/' + companyId;
    return this.http.put(apicall, postData)

  }
  get(companyId: string): Observable<any> {
    return this.db.doc(`${this.companyCollection}/${companyId}`).valueChanges();
  }
  deletCompany(companyId) {
    const apicall = environment.baseAPIDomain + '/api/v1/companies/' + companyId;
    return this.http.delete(apicall);
  }

  getAllCompanies(userId, limit: number = 10, navigation: string = "first", lastVisible = null) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection<Company[]>(`${this.companyCollection}`, ref => ref
      .where("owner.id", "==", userId)
      .orderBy('created_at', 'desc')
      .limit(limit)
    )
    switch (navigation) {
      case 'next':
        dataQuery = this.db.collection<Company[]>(`${this.companyCollection}`, ref => ref
          .where("owner.id", "==", userId)
          .orderBy('created_at', 'desc')
          .limit(limit)
          .startAfter(lastVisible))
        break;
    }
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        companyList: actions.map(a => {

          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    })
    );
  }

  getComanyFollowers(companyId, limit: number = 10, navigation: string = "first", lastVisible = null) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection(this.companyCollection).doc(companyId).collection(`${this.followersCollection}`, ref => ref
      .limit(limit)
    )
    switch (navigation) {
      case 'next':
        dataQuery = this.db.collection(this.companyCollection).doc(companyId).collection(`${this.followersCollection}`, ref => ref
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
}

