import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Charity } from 'src/app/shared/interfaces/charity.type';
import { take, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class StoreSetting {
    private basePath = '/stores/';
    private storeCollection = 'stores';
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

    addStore(postData) {
        const apicall = environment.baseAPIDomain + '/api/v1/stores';
        return this.http.post(apicall, postData)

    }
    updateStore(postData, storeId) {
        const apicall = environment.baseAPIDomain + '/api/v1/stores/' + storeId;
        return this.http.put(apicall, postData)

    }

    getStoreById(storeId: string): Observable<any> {
        return this.db.doc(`${this.storeCollection}/${storeId}`).valueChanges();
    }
    addProduct(postData) {
        const apicall = environment.baseAPIDomain + '/api/v1/stores/OSDiD711Xvkyd2SjVr8I/products';
        return this.http.post(apicall, postData)

    }





}

