import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';

import { UserService } from './user.service';
import { User } from '../interfaces/user.type';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})

export class MessagingService {

  private currentUser: User;
  currentMessage = new BehaviorSubject(null);

  constructor(private userService: UserService, private angularFireMessaging: AngularFireMessaging, private notification: NzNotificationService) {
    angularFireMessaging.onMessage((payload) => {
      console.log('Got foreground push', payload);
      if (payload.notification && payload.notification.title && payload.notification.body) {
        notification.blank(
          payload.notification.title,
          payload.notification.body,
          { nzDuration: 5000, nzAnimate: true }
        );
      }
    });

    angularFireMessaging.onTokenRefresh((data) => {
      this.requestPermission();
    });
  }

  requestPermission() {
    // todo this should be handled another way
    console.log('Notifications permission suspended for now.')
    // this.angularFireMessaging.requestPermission.subscribe(data => {
    //   this.getToken()
    // }, err => {
    //   console.log('Unable to get permission to notify.', err);
    // });
  }

  getToken() {
    this.angularFireMessaging.getToken.subscribe(currentToken => {
      if (currentToken) {
        console.log('Device Token', currentToken);
        this.sendTokenToServer(currentToken);
      } else {
        // Show permission request.
        this.requestPermission();
      }
    }, err => {
      console.log('An error occurred while retrieving token. ', err);
    });
  }

  sendTokenToServer(token: string) {
    this.userService.getCurrentUser().then((user) => {
      this.currentUser = { id: user.uid, email: user.email, avatar: user.photoURL, fullname: user.displayName };
      if (this.currentUser.id) {
        console.log('Sending Token To Server', token);
        this.userService.updateUser(this.currentUser.id, {
          notification_token: token
        }).subscribe(data => {
          console.log(`Updated user notification_token for user : ${this.currentUser.id}`, data);
        }, err => {
          console.error(`Failed to update notification_token for user : ${this.currentUser.id}`, err);
        })
      }
    });
  }

}
