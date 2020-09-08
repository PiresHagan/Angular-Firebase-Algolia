import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { map, take } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { AdUnitConstant } from 'src/app/shared/constants/ad-unit-constant';

@Injectable({
  providedIn: 'root'
})
export class BackofficeAdNetworkService {

  adnetworksCollections = 'adnetworks';
  sitesSubCollection = 'sites';
  adUnitsSubCollection = 'units';

  constructor(private http: HttpClient, private db: AngularFirestore) { }

  addNewSite(publisherId, siteData) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + `/api/v1/adnetworks/${publisherId}/sites`, siteData).subscribe((result) => {
        resolve(result) 
      }, (error) => {
        reject(error)
      })
    })
  }

  updateSite(publisherId: string, siteId: string, siteData) {
    return new Promise((resolve, reject) => {
      return this.http.put(environment.baseAPIDomain + `/api/v1/adnetworks/${publisherId}/sites/${siteId}`, siteData).subscribe((siteData) => {
        resolve(siteData)
      }, (error) => {
        reject(error)
      })
    })
  }

  deleteSite(publisherId, siteId) {
    return this.http.delete(environment.baseAPIDomain + `/api/v1/adnetworks/${publisherId}/sites/${siteId}`);
  }

  getSitesByPublisher(publisherId, limit: number = 10, lastVisible = null) {
    let dataQuery = this.db.collection(this.adnetworksCollections).doc(publisherId).collection(`${this.sitesSubCollection}`, ref => ref.orderBy('created_at', 'desc'))
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        sites: actions.map(a => {
          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    })
    );
  }

  getSiteById(siteId: string) {
    return this.db.collectionGroup(this.sitesSubCollection, ref => ref.where('id', '==', siteId)).snapshotChanges().pipe(map(data => {
      return data.map(a => {
        const data: any = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })
    }));
  }

  addSiteAdUnit(publisherId, adUnitData) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + `/api/v1/adnetworks/${publisherId}/units`, adUnitData).subscribe((result) => {
        resolve(result) 
      }, (error) => {
        reject(error)
      })
    })
  }

  updateSiteAdUnit(publisherId: string, adUnitId: string, adUnitData) {
    return new Promise((resolve, reject) => {
      return this.http.put(environment.baseAPIDomain + `/api/v1/adnetworks/${publisherId}/units/${adUnitId}`, adUnitData).subscribe((result) => {
        resolve(result)
      }, (error) => {
        reject(error)
      })
    })
  }

  deleteSiteAdUnit(publisherId, adUnitId) {
    return this.http.delete(environment.baseAPIDomain + `/api/v1/adnetworks/${publisherId}/units/${adUnitId}`);
  }

  getSiteAdUnits(publisherId, siteId, limit: number = 10, lastVisible = null) {
    let dataQuery = this.db.collection(this.adnetworksCollections).doc(publisherId).collection(`${this.adUnitsSubCollection}`, ref => ref.where('site_id', '==', siteId).orderBy('created_at', 'desc'))
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        siteAdUnits: actions.map(a => {
          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    })
    );
  }

  getSiteAdUnitsForPublisher(publisherId, siteId, limit: number = 10, lastVisible = null) {
    let dataQuery = this.db.collection(this.adnetworksCollections).doc(publisherId).collection(`${this.adUnitsSubCollection}`, ref => 
      ref.where('site_id', '==', siteId).where('status.title', '==', AdUnitConstant.ACTIVE.title).orderBy('created_at', 'desc'))
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        siteAdUnits: actions.map(a => {
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
