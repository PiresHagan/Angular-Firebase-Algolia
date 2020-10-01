import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Charity } from 'src/app/shared/interfaces/charity.type';
import { take, map } from 'rxjs/operators';
import { Store } from 'src/app/shared/interfaces/ecommerce/store';

@Injectable({
    providedIn: 'root'
})
export class StoreSetting {
    private basePath = '/stores/';
    private storeCollection = 'stores';
    private productCollection = 'store-products';
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
    updateStore(storeId, postData) {
        const apicall = environment.baseAPIDomain + '/api/v1/stores/' + storeId;
        return this.http.put(apicall, postData)

    }

    getStoreById(userId: string): Observable<any> {
        //return this.db.doc(`${this.storeCollection}/${storeId}`).valueChanges();

        let dataQuery = this.db.collection<Store[]>(`${this.storeCollection}`, ref => ref
            .where("ownerId", "==", userId)
        )
        return dataQuery.snapshotChanges().pipe(map(actions => {
            return actions.map(a => {

                const data: any = a.payload.doc.data();
                const id = a.payload.doc.id;
                return { id, ...data };
            })

        })
        );

    }

    addOrUpdateProduct(storeId, postData, productId) {
        if (!productId) {
            const apicall = environment.baseAPIDomain + '/api/v1/stores/' + storeId + '/products';
            return this.http.post(apicall, postData)
        } else {
            const apicall = environment.baseAPIDomain + '/api/v1/stores/' + storeId + '/products/' + productId;
            return this.http.put(apicall, postData)
        }


    }
    updateProduct(storeId, productId, postData) {
        const apicall = environment.baseAPIDomain + '/api/v1/stores/' + storeId + '/products/' + productId;
        return this.http.post(apicall, postData)

    }
    getProducts(storeId: string): Observable<any> {
        //return this.db.doc(`${this.storeCollection}/${storeId}`).valueChanges();

        let dataQuery = this.db.collection(`${this.productCollection}`, ref => ref
            .where("storeId", "==", storeId)
        )
        return dataQuery.snapshotChanges().pipe(map(actions => {
            return actions.map(a => {

                const data: any = a.payload.doc.data();
                const id = a.payload.doc.id;
                return { id, ...data };
            })

        })
        );

    }

    deleteProduct(storeId, productId) {
        const apicall = environment.baseAPIDomain + '/api/v1/stores/' + storeId + '/products/' + productId;
        return this.http.delete(apicall);
    }
    getProduct(storeId, productId) {
        return this.db.collection(this.productCollection).doc(productId).valueChanges()
    }
    updateBilling(storeId) {

        return this.http.post(environment.baseAPIDomain + '/api/v1/payment/sessions/stores/' + storeId + '/connectedAccount', {

            redirectUrl: window && window.location && window.location.href || '',
            refreshUrl: window && window.location && window.location.href || ''
        })

    }
    getCustomerOrder() {
        const apicall = environment.baseAPIDomain + '/api/v1/store-orders';
        return this.http.get(apicall);
    }

    getStoreOrders(storeId) {
        const apicall = environment.baseAPIDomain + '/api/v1/stores/' + storeId + '/orders';
        return this.http.get(apicall);

    }

    getStoreOrderDetails(storeId, orderId) {
        const apicall = environment.baseAPIDomain + '/api/v1/stores/' + storeId + '/orders/' + orderId;
        return this.http.get(apicall);

    }
    getCustomerOrderDetails(orderId) {
        const apicall = environment.baseAPIDomain + '/api/v1/store-orders/' + orderId;
        return this.http.get(apicall);

    }
    updateTrackingInfo(storeId, orderId, data) {
        const apicall = environment.baseAPIDomain + '/api/v1/stores/' + storeId + '/orders/' + orderId;
        return this.http.put(apicall, data);

    }







}

