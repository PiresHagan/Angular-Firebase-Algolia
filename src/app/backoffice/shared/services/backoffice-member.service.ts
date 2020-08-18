
import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentReference, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { take, map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { User } from "src/app/shared/interfaces/user.type";
import { HttpClient } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class BackofficeMemberService {
  private basePath = '/avatars';
  private userCollection: string = 'users';
  private memberCollection: string = 'members';
  private invitationCollection: string = "invitation";

  isLoggedInUser = new BehaviorSubject<boolean>(false);
  isLoggedInUserChanges: Observable<boolean> = this.isLoggedInUser.asObservable();

  currentUser: User;
  constructor(
    public db: AngularFirestore,
    public afAuth: AngularFireAuth,
    private http: HttpClient
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user && !user.isAnonymous)
        this.currentUser = { id: user.uid, email: user.email, avatar: user.photoURL, fullname: user.displayName };
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

  uploadContact(uid: string, provider: string, contacts: any): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      this.db.collection(this.userCollection).doc(uid).collection(this.invitationCollection).doc(provider).set({ contacts: contacts }).then(() => {
        resolve();
      }).catch(() => {
        reject();
      })
    })
  }
  getContacts(uid: string, provider): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      this.db.collection(this.userCollection).doc(uid).collection(this.invitationCollection).doc(provider).valueChanges().subscribe((data) => {
        resolve(data);
      })
    })
  }

  setupConnectedAccount(memberId: string) {
    return this.http.post(environment.baseAPIDomain + `/api/v1/payment/sessions/members/${memberId}/connectedAccount`, {
      redirectUrl: window && window.location && window.location.href || '',
      refreshUrl: window && window.location && window.location.href || ''
    })
  }

  getMemberByUid(uid: string): Observable<any> {
    return this.db.doc(`${this.memberCollection}/${uid}`).valueChanges();
  }
}
