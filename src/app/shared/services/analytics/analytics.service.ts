import { Injectable } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavigationEnd, Router } from '@angular/router';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(
    private analytics: AngularFireAnalytics,
    private router: Router,
    private fAuth: AngularFireAuth,
  ) {
    this.handleAnalyticsPageView();
  }

  private handleAnalyticsPageView() {
    this.logPageViewEvt();

    this.router.events.subscribe(async (evt) => {
      if (evt instanceof NavigationEnd) {
        this.logPageViewEvt();
      }
    });
  }

  private async logPageViewEvt() {
    const user = await this.fAuth.currentUser;

    const provider = user ? user?.providerData.length > 0
      ? user?.providerData[0].providerId : user?.providerId : undefined;

    this.logEvent('page_view', {
      user_uid: user?.uid,
      user_email: user?.email,
      user_name: user?.displayName || 'Anonymous',
      provider_id: provider,
      current_path: window.location.href,
      origin: window.location.origin
    });
  }

  public logEvent(name: string, payload: { [key: string]: any }): void {
    this.analytics.logEvent(name, payload);
  }

  public logEvents(name: string, payloads: { [key: string]: any }[]): void {
    payloads.forEach(item => this.logEvent(name, item));
  }
}
