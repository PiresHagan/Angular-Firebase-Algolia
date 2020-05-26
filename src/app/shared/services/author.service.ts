import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import 'firebase/storage';



@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  authorsCollection: string = 'bak_authors';

  constructor(private afs: AngularFirestore) { }

  getUserBySlug(slug: string) {
    return this.afs.collection(this.authorsCollection, ref =>
      ref.where("slug", "==", slug)
    ).snapshotChanges().pipe(map(actions => {
      return actions ? actions[0].payload.doc.data() : null;
    })
    );
  }
  getAuthorsById(authoIdArray: []) {
    return this.afs.collection(this.authorsCollection, ref =>
      ref.where("id", "in", authoIdArray.slice(0, 9))
    ).snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        return data;
      });
    })
    );

  }
  reportAbusedUser(userId: string) {

    return new Promise<any>((resolve, reject) => {
      this.afs.collection(`${this.authorsCollection}`).doc(`${userId}`).update({ is_abused: true }).then(() => {
        resolve();
      })
    })
  }


}