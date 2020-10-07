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
        if (this.afAuth.currentUser) {
          const user = firebase.auth().currentUser;
          console.log(user);

        } else {
          // viewing page as anonymous
          console.log('Here viering...');
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
