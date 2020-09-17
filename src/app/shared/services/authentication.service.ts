import { Injectable } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/auth';
import { first, tap, catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as firebase from 'firebase/app';
import { STAFF, MEMBER } from "../constants/member-constant";
import { MessagingService } from "./messaging.service";
import { UserService } from "./user.service";


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    loggedInUser;
    loggedInUserDetails;
    constructor(public afAuth: AngularFireAuth, public db: AngularFirestore, private http: HttpClient, private messagingService: MessagingService, private userService: UserService) {
        this.afAuth.authState.subscribe((user) => {
            if (!user || !user.emailVerified) {
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
            }
            if (!uid) {
                this.getMember(uid).subscribe((userData) => {
                    resolve(userData)
                })
            } else {
                resolve(null)
            }

        })
    }
    get(uid: string): Observable<any> {
        return this.db.doc(`users/${uid}`).valueChanges();
    }
    getMember(uid: string): Observable<any> {
        return this.db.doc(`members/${uid}`).valueChanges();
    }

    doRegister(email: string, password: string, displayName) {
        return new Promise<any>((resolve, reject) => {
            this.http.post(environment.baseAPIDomain + '/api/v1/auth/sign-up', {
                email: email,
                password: password,
                displayName: displayName
            }).subscribe((data) => {
                resolve(data);
            }, err => reject(err))
        })
    }

    doLogin(email: string, password: string) {
        return new Promise<any>((resolve, reject) => {
            this.afAuth.signInWithEmailAndPassword(email, password)
                .then(res => {
                    const analytics = firebase.analytics();

                    if (res && !res.user.emailVerified)
                        firebase.auth().currentUser.sendEmailVerification();

                    if (res && !res.user.emailVerified)
                        firebase.auth().currentUser.sendEmailVerification();

                    analytics.logEvent("login", {
                        user_uid: res.user.uid,
                        user_email: res.user.email,
                        user_name: res.user.displayName,
                        provider_id: res.user.providerData.length > 0 ? res.user.providerData[0].providerId : res.additionalUserInfo.providerId
                    });

                    this.messagingService.requestPermission();

                    resolve(res);
                }, err => reject(err))
        })
    }

    signout() {
        return new Promise((resolve, reject) => {
            if (this.afAuth.currentUser) {
                const user = firebase.auth().currentUser;

                this.afAuth.signOut().then(() => {
                    const analytics = firebase.analytics();


                    analytics.logEvent("logout", {
                        user_uid: user.uid,
                        user_email: user.email,
                        user_name: user.displayName,
                        provider_id: user.providerData.length > 0 ? user.providerData[0].providerId : user.providerId
                    });

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
    checkDejangoCred(userData) {
        return this.http.post(environment.authService, userData)
    }

    getIdToken() {
        return this.afAuth.idToken;
    }

    getUserToken() {
        return firebase.auth().currentUser.getIdToken(true)
    }
    async getCustomClaimData() {
        try {
            const idTokenResult = await firebase.auth().currentUser.getIdTokenResult();
            if (idTokenResult.claims.isAdmin) {
                return STAFF;
            } else {
                return MEMBER;
            }
        } catch (error) {
            return MEMBER;
        }
    }
    validateCaptcha(captchaToken) {
        const httpOptions = { headers: { skip: "true" } };

        return this.http.post(environment.baseAPIDomain + '/api/validateCaptcha', {
            token: captchaToken,
        }, httpOptions)

    }
    getLoginDetails() {
        return this.loggedInUser;
    }
    getSlug(displayName: string) {
        return this.slugify(displayName)
    }

    slugify(string) {
        return string
            .toString()
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z ]/g, "")
            .replace(/\s+/g, "-")
            .replace(/[^\w\-]+/g, "")
            .replace(/\-\-+/g, "-")
            .replace(/^-+/, "")
            .replace(/-+$/, "");
    }

}