import { Injectable } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/auth';
import { first } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { HttpClient, HttpResponse } from '@angular/common/http';
import * as firebase from 'firebase/app';
import { STAFF, MEMBER } from "../constants/member-constant";
import { MessagingService } from "./messaging.service";
import { AnalyticsService } from "./analytics/analytics.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoading = false;
  loggedInUser;
  loggedInUserDetails;

  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFirestore,
    private http: HttpClient,
    private messagingService: MessagingService,
    private analyticsService: AnalyticsService,
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (!user || !user.emailVerified) {
        if (environment && environment.isAnonymousUserEnabled) {
          this.afAuth.signInAnonymously().catch(function () {
            // console.log('anonymusly login');
          });
        }
      } else {
        this.loggedInUser = user;
      }
    });
  }
  getLoggedInUserDetails(uid: string = '') {
    return new Promise<any>((resolve) => {
      if (!uid && this.loggedInUser) {
        uid = this.loggedInUser.uid
      }
      if (uid) {
        this.getMember(uid).subscribe((userData) => {
          resolve(userData)
        })
      } else {
        resolve(null)
      }

    })
  }
  getLoggedInUser(uid: string = '') {
    return new Promise<any>((resolve) => {
        if (!uid && this.loggedInUser) {
            uid = this.loggedInUser.uid
        }
        if (uid) {
            this.get(uid).subscribe((userData) => {
                resolve(userData)
            })
        } else {
            resolve(null)
        }

    })
}

  sendPasswordResetEmail(email) {
    return new Promise<any>((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + '/api/v1/auth/forgot-password', {
        email
      }).subscribe(async (data) => {
        resolve(data);
      }, err => reject(err))
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
      }).subscribe(async (data) => {
        (await this.afAuth.currentUser).sendEmailVerification();
        resolve(data);
      }, err => reject(err))
    })
  }

  doRegisterOnBoarding(email: string, password: string, displayName, referral_code) {
    return new Promise<any>((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + '/api/v1/auth/sign-up', {
          email: email,
          password: password,
          displayName: displayName,
          referral_code: referral_code,
      }).subscribe((data) => {
          this.doLogin(email, password).then( result => {
              resolve(data);
          }).catch( error => {
              reject(error);
          });
      }, err => reject(err))
    })
  }

  doLogin(email: string, password: string) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(email, password)
        .then(async (res) => {
          if (res && !res.user.emailVerified)
            (await this.afAuth.currentUser).sendEmailVerification();

          this.analyticsService.logEvent("login", {
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
    return new Promise(async (resolve, reject) => {
      if (this.afAuth.currentUser) {
        this.revokeAllSessions();

        const user = await this.afAuth.currentUser;

        this.afAuth.signOut().then(() => {
          this.analyticsService.logEvent("logout", {
            user_uid: user.uid,
            user_email: user.email,
            user_name: user.displayName,
            provider_id: user.providerData.length > 0 ? user.providerData[0].providerId : user.providerId
          });

          resolve();
        });
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

  async getUserToken() {
    return this.afAuth.currentUser.then(u => u.getIdToken(true));
  }

  async getCustomClaimData() {
    try {
      const user = await this.afAuth.currentUser;
      const idTokenResult = await user.getIdTokenResult();
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

  redirectToConsole(url: string, queryParams: object) {
    this.isLoading = true;
    const body = {
      uid: this.loggedInUser.uid
    }
    this.http.post(`${environment.baseAPIDomain}/api/v1/authshared/getSharedToken`, body).subscribe((data: any) => {
      if (data.token) {
        window.open(`${url}?token=${data.token}&queryParams=${JSON.stringify(queryParams)}`, '_self');
      }
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
    })
  }

  revokeAllSessions() {
    const body = {
      uid: this.loggedInUser.uid
    }
    this.http.post(`${environment.baseAPIDomain}/api/v1/authshared/revokeAllSessions`, body).subscribe((data: any) => {
      // console.log('All sessions revoked');
    }, err => {
      // console.error('Error while revoking all sessions');
    })
  }

}
