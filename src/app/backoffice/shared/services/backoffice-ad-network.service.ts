import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackofficeAdNetworkService {

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
}
