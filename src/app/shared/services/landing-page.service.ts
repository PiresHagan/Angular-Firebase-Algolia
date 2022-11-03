import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { LandingPage } from '../interfaces/landingpage.type'
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class LandingPageService {
  private landingPageCollection = 'subscribe-user-type-landing-pages';

  constructor(
    private db: AngularFirestore
  ) { }

  getLandingPageData(lang: string, slug: string) {
    return this.db.collection<LandingPage[]>(`${this.landingPageCollection}`, ref => ref
      .where("lang", "==", lang)
      .where("slug", "==", slug)
      ).snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );;
  }
}
