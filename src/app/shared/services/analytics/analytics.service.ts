import { Injectable } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { NavigationEnd, Router } from '@angular/router';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(
    private analytics: AngularFireAnalytics,
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
            provider_id: user.providerData.length > 0 ? user.providerData[0].providerId : user.providerId,
            page_view: window.location.href
          });
        }
      }
    });
  }

  public logEvent(name: string, payload: { [key: string]: any }): void {
    this.analytics.logEvent(name, payload);
  }

  public logEvents(name: string, payloads: { [key: string]: any }[]): void {
    payloads.forEach(item => this.logEvent(name, item));
  }
}
