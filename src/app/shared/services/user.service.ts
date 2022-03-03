
import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentReference, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { User } from "../interfaces/user.type";
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { take, map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Member } from "../interfaces/member.type";
import { HttpClient } from "@angular/common/http";
import { AngularFireStorage } from "@angular/fire/storage";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private basePath = '/avatars';
  private userCollection: string = 'users';
  private memberCollection: string = 'members';
  private invitationCollection: string = "invitation";

  isLoggedInUser = new BehaviorSubject<boolean>(false);
  isLoggedInUserChanges: Observable<boolean> = this.isLoggedInUser.asObservable();
  userData: User;
  currentUser: User;
  constructor(
    public db: AngularFirestore,
    public afAuth: AngularFireAuth,
    private http: HttpClient,
    private storage: AngularFireStorage,
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user && !user.isAnonymous) {
        this.currentUser = { id: user.uid, email: user.email, avatar: user.photoURL, fullname: user.displayName };
        this.get(user.uid).subscribe( data => {
          this.userData = data;
        })
      }
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
          // console.log('No user logged in');
        }
      })
    })
  }

  getUserTypeData() {
    return new Promise<any>((resolve, reject) => {
      this.http.get(environment.baseAPIDomain + '/api/v1/onBoarding/getUserType').subscribe((data) => {
        resolve(data);
      }, err => reject(err))
    })
  }

  get(uid: string): Observable<any> {
    return this.db.doc(`${this.userCollection}/${uid}`).valueChanges();
  }
  getMember(uid: string): Observable<any> {
    return this.db.doc(`${this.memberCollection}/${uid}`).valueChanges();
  }

  updateCurrentUserProfile(value) {
    return new Promise<any>(async (resolve, reject) => {
      var user = await this.afAuth.currentUser;
      user.updateProfile(value).then(res => {
        resolve(res)
      }, err => reject(err))
    })
  }

  async updatePassword(password: string) {
    let user = await this.afAuth.currentUser;
    return user.updatePassword(password)
  }

  update(uid: string, fields: any): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      this.db.doc(`${this.userCollection}/${uid}`).update(fields).then(() => {
        resolve();
      }).catch(() => {
        reject();
      })

    })
  }
  updateMember(uid: string, fields: any): Promise<void> {

    return new Promise<any>((resolve, reject) => {
      this.http.put(environment.baseAPIDomain + '/api/v1/members/' + uid, fields).subscribe(() => {
        resolve();
      }, err => reject(err))
      // this.db.doc(`${this.memberCollection}/${uid}`).update(fields).then(() => {

      // }).catch(() => {
      //   reject();
      // })

    })
  }

  sendInvitation(userUid: string, data) {
    return new Promise<any>((resolve, reject) => {
      this.http.post(`${environment.baseAPIDomain}/api/v1/onBoarding/${userUid}/sendInvite`, data).subscribe(() => {
        resolve(true);
      }, err => reject(err));
    })
  }

  updateBasicDetails(uid: string, fields: any): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      this.http.post(`${environment.baseAPIDomain}/api/v1/onboarding/${uid}/updateBasicDetails`, fields).subscribe(() => {
        resolve(true);
      }, err => reject(err));
    })
  }

  updateSpecificDetails(uid: string, fields: any): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      this.http.post(`${environment.baseAPIDomain}/api/v1/onboarding/${uid}/updateSpecificDetails`, fields).subscribe(() => {
        resolve(true);
      }, err => reject(err));
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

  public createUser(user: User, memberData: Member) {

    return new Promise<any>(async (resolve, reject) => {
      await this.db.doc(
        `${this.userCollection}/${user.id}`
      ).set({ ...user }, { merge: true })
      await this.db.doc(
        `${this.memberCollection}/${user.id}`
      ).set({ ...memberData })
      resolve();
    }).catch((error) => {
      // console.log(error);
    })
  }

  addProfileImage(uid: string, file: string, fileName: string) {
    return new Promise((resolve, reject) => {
      this.storage.ref(`${this.basePath}/${this.currentUser.email}`).putString(file, "data_url").then(
        snapshot => {
          snapshot.ref.getDownloadURL().then((downloadURL) => {
            const imageUrl: string = downloadURL;
            resolve({
              url: imageUrl,
              alt: fileName
            });

          }).catch(err => {
            console.info(err);
            reject(err)
          })
        }).catch((error) => {
          alert(error)

          reject(error);
        })

    })
  }
  delete(uid: string): Promise<void> {
    return this.db.doc(`${this.userCollection}/${uid}`).delete();
  }
  getByEmail(email: string): Observable<User[]> {
    return this.db.collection<User>(`${this.userCollection}`, ref =>
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
  private removeExt(fileName) {
    return fileName.split('.').slice(0, -1).join('.');
  }

  updateUser(userId: string, fields) {
    const updateUserAPI = environment.baseAPIDomain + `/api/v1/users/${userId}`;
    return this.http.put(updateUserAPI, fields)
  }
}
