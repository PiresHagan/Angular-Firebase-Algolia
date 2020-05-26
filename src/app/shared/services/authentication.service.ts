import { Injectable } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/auth';
import { first } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    loggedInUser;
    loggedInUserDetails;
    constructor(public afAuth: AngularFireAuth, public db: AngularFirestore) {
        this.afAuth.authState.subscribe((user) => {
            if (!user) {
                if (environment && environment.isAnonymousUserEnabled) {
                    this.afAuth.signInAnonymously().catch(function (error) {
                        console.log('anonymusly login');
                    });
                }
            } else {
                this.loggedInUser = user;
            }
        });
    }
    getLoggedInUserDetails(uid: string = '') {
        return new Promise<any>((resolve, reject) => {
            if (!uid && this.loggedInUser) {
                uid = this.loggedInUser.uid
            } else {
                reject('User Is Not Initialized');
            }
            this.get(uid).subscribe((userData) => {
                resolve(userData)
            })

        })
    }
    get(uid: string): Observable<any> {
        return this.db.doc(`users/${uid}`).valueChanges();
    }

    doRegister(email: string, password: string, displayName) {
        return new Promise<any>((resolve, reject) => {
            this.afAuth.createUserWithEmailAndPassword(email, password)
                .then(res => {
                    res.user.updateProfile({ displayName }).then((user) => {
                        resolve(res);
                    }).catch(err => reject(err))

                }, err => reject(err))
        })
    }

    doLogin(email: string, password: string) {
        return new Promise<any>((resolve, reject) => {
            this.afAuth.signInWithEmailAndPassword(email, password)
                .then(res => {
                    resolve(res);
                }, err => reject(err))
        })
    }

    signout() {
        return new Promise((resolve, reject) => {
            if (this.afAuth.currentUser) {
                this.afAuth.signOut().then(() => {

                    resolve();
                })

            }
            else {
                reject();
            }
        });
    }
    isLoggedIn() {
        return this.afAuth.authState.pipe(first()).toPromise();
    }
    getAuthState() {
        return this.afAuth.authState;
    }
}