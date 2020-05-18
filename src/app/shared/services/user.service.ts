
import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentReference, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { User } from "../interfaces/user.type";
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { take, map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private basePath = '/avatar';
  isLoggedInUser = new BehaviorSubject<boolean>(false);
  isLoggedInUserChanges: Observable<boolean> = this.isLoggedInUser.asObservable();

  currentUser: User;
  constructor(
    public db: AngularFirestore,
    public afAuth: AngularFireAuth,


  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user && !user.isAnonymous)
        this.currentUser = user;
    })

  }

  get activeUser() {
    return this.currentUser;
  }
  getCurrentUser() {
    return new Promise<any>((resolve, reject) => {
      var user = this.afAuth.onAuthStateChanged(function (user) {
        if (user && !user.isAnonymous) {
          resolve(user);
        } else {
          console.log('No user logged in');
        }
      })
    })
  }
  get(uid: string): Observable<any> {
    return this.db.doc(`users/${uid}`).valueChanges();
  }

  updateCurrentUserProfile(value) {
    return new Promise<any>((resolve, reject) => {
      var user = firebase.auth().currentUser;
      user.updateProfile(value).then(res => {
        resolve(res)
      }, err => reject(err))
    })
  }
  updatePassword(password: string) {
    let user = firebase.auth().currentUser;
    return user.updatePassword(password)
  }

  update(uid: string, fields: any): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      this.db.doc(`users/${uid}`).update(fields).then(() => {
        resolve();
      }).catch(() => {
        reject();
      })

    })


  }

  public createUser(user: User) {
    return new Promise<any>((resolve, reject) => {

      const userRef: AngularFirestoreDocument<any> = this.db.doc(
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
      userRef.set(
        { ...userData },
        {
          merge: true,
        }
      );
      resolve();


    })
  }
  addProfileImage(uid: string, file: string) {
    return new Promise((resolve, reject) => {
      firebase.storage().ref(`${this.basePath}/${this.currentUser.email}`).putString(file, "data_url").then(
        snapshot => {
          snapshot.ref.getDownloadURL().then((downloadURL) => {
            const imageUrl: string = downloadURL;
            this.db.collection('users').doc(uid).update({ photoURL: imageUrl }).then(() => {
              this.updateCurrentUserProfile({ photoURL: imageUrl }).then(res => resolve()).catch(err => reject(err))
            }).catch(err => reject(err))

          }).catch(err => reject(err))
        }).catch((error) => {
          console.log(error);
          reject();
        });

    })
  }
  delete(uid: string): Promise<void> {
    return this.db.doc(`users/${uid}`).delete();
  }
  getByEmail(email: string): Observable<User[]> {
    return this.db.collection<User>('users', ref =>
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


}