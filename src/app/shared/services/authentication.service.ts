import { Injectable } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/auth';
import { first } from "rxjs/operators";
import { BehaviorSubject, Observable, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(public afAuth: AngularFireAuth) { }
    user$;

    ngInit() {
        this.user$ = this.afAuth.authState
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