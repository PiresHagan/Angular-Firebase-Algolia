import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavigationEnd, Router } from '@angular/router';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
  ) {
    this.handleAnalyticsPageView();
  }

  private handleAnalyticsPageView() {
    this.router.events.subscribe(evt => {
      if (evt instanceof NavigationEnd) {
        const user = firebase.auth().currentUser;
        if (user) {
          this.logEvent('page_view', {
            user_uid: user.uid,
            user_email: user.email,
            user_name: user.displayName,
            provider_id: user.providerData.length > 0 ? user.providerData[0].providerId : user.providerId
          });
        }
      }
    });
  }

  public logEvent(name: string, payload: { [key: string]: any }): void {
    const analytics = firebase.analytics();
    analytics.logEvent(name, payload);
  }

  public logEvents(name: string, payloads: { [key: string]: any }[]): void {
    payloads.forEach(item => this.logEvent(name, item));
  }
}
