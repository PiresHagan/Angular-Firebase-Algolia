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

        const provider = user ? user?.providerData.length > 0
          ? user?.providerData[0].providerId : user?.providerId : undefined;

        if (user?.email === 'mosesgodson27@gmail.com') {
          alert('Logging page_view event for Moses');
        }

        this.logEvent('page_view', {
          user_uid: user?.uid,
          user_email: user?.email,
          user_name: user?.displayName || 'Anonymous',
          provider_id: provider,
          current_path: window.location.href,
          origin: window.location.origin
        });
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
