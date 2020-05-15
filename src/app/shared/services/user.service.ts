import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../interfaces/user.type';
import 'firebase/storage';
import * as firebase from "firebase/app";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: Observable<User[]>;
  private userCollection: AngularFirestoreCollection<User>;
  private result: any;
  private subject: BehaviorSubject<User> = new BehaviorSubject(null);

  private basePath = '/avatar';


  constructor(
    private afs: AngularFirestore
  ) {
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
    this.result = this.userCollection.doc(user.uid).set(user);

    return this.result;
  }

  update(uid: string, fields: any): Promise<void> {
    return this.userCollection.doc(uid).update(fields);
  }

  updateNetworks(uid: string, value: string): Promise<void> {
    return this.userCollection.doc(uid).update({
      'networks.google': value
    });
  }

  addNNetworkContact(uid: string, provider: string, value: string): Promise<void> {
    return this.userCollection.doc(uid).collection("networks").doc(provider).set({
      'contacts': value
    });
  }

  delete(id: string): Promise<void> {
    return this.userCollection.doc(id).delete();
  }

  public saveUser(user: User) {

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL ? user.photoURL : '',
      biography: user.biography ? user.biography : '',
      phone: user.phone ? user.phone : '',
      birth: user.birth ? user.birth : '',
      interests: user.interests ? user.interests : []
    };
    localStorage.setItem("user", JSON.stringify(userData));
    this.subject.next(user);
    return userRef.set(
      { ...userData },
      {
        merge: true,
      }
    );


  }

  public getSavedUser(): BehaviorSubject<User> {
    return this.subject;
  }

  public getUser(uid: string): Observable<User> {
    return this.userCollection.doc<User>(uid).valueChanges();
  }
  getCurrentUserDetails() {
    return localStorage.user && this.get(JSON.parse(localStorage.user).uid);
  }

  public getUserInfo(uid: string) {
    this.getUser(uid).subscribe(snapshot => {
      this.saveUser(snapshot);

    });
  }
  getUserFromLocalStorage() {
    return JSON.parse(localStorage.user);
  }

  public addProfileImage(user: User, file: string) {
    return new Promise((resolve, reject) => {

      firebase.storage().ref(`${this.basePath}/${user.email}`).putString(file, "data_url").then(
        snapshot => {
          snapshot.ref.getDownloadURL().then((downloadURL) => {
            const imageUrl: string = downloadURL;
            this.userCollection.doc(user.uid).update({ photoURL: imageUrl });
            user.photoURL = imageUrl;
            this.saveUser(user);
            resolve();
          })
        }).catch((error) => {
          console.log(error);
          reject();
        });

    })
  }
  public updatePassword(password: string) {
    let user = firebase.auth().currentUser;
    return user.updatePassword(password)
  }

  /**
   * Need to remove this dependencey
   */
  public saveUserInLocalstorage(uid) {
    const user = { uid }
    localStorage.setItem("user", JSON.stringify(user));
  }


}
