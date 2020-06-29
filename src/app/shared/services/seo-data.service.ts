import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { SeoData } from '../interfaces/seo-data.type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeoDataService {

  private seoDataCollection  = 'seo_data';

  constructor(private db: AngularFirestore) { }

  getSeoData(documentId: string): Observable<any> {
    return this.db.collection(this.seoDataCollection).doc(documentId).get();
  } 
}
