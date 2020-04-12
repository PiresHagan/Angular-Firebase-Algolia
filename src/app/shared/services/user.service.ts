import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user.type';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: Observable<User[]>;
  private userCollection: AngularFirestoreCollection<User>;
  private result: any;

  constructor(
     private afs: AngularFirestore
    ) 
    { 
    this.userCollection = this.afs.collection<User>('users');
    this.users = this.userCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  
  }

  getAll(): Observable<User[]> {
    return this.users;
  }
 
  get(id: string): Observable<User> {
    return this.userCollection.doc<User>(id).valueChanges().pipe(
      take(1),
      map(user => {
        console.log(user);
        user.uid = id;
        return user
      })
    );
  }

  getByEmail(email: string): Observable<User[]> {
    return this.afs.collection<User>('users', ref =>
        ref.where("email", "==", email)
      )
      .snapshotChanges()
      .pipe(
        take(1),
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }
 

  add(user: User): Promise<DocumentReference> {
    this.result =  this.userCollection.doc(user.uid).set(user);

    return this.result ;
  }

  update(uid: string, fields:any): Promise<void> {
    return this.userCollection.doc(uid).update(fields);
  }

  updateNetworks(uid: string, value: string): Promise<void> {
    return this.userCollection.doc(uid).update({
      'networks.google': value
    });
  }

  addNNetworkContact(uid: string, provider:string, value: string): Promise<void> {
    return this.userCollection.doc(uid).collection("networks").doc(provider).set({
      'contacts': value
    });
  }

  delete(id: string): Promise<void> {
    return this.userCollection.doc(id).delete();
  }

}
