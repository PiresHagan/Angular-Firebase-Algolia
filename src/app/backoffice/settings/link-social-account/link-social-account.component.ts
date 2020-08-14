import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
declare var FB: any;

@Component({
  selector: 'app-link-social-account',
  templateUrl: './link-social-account.component.html',
  styleUrls: ['./link-social-account.component.scss']
})

export class LinkSocialAccountComponent implements OnInit {

  fbloading: boolean = false;
  fbAccountLinkStatus: boolean = false;
  userFirendsList = [];

  constructor() { }

  ngOnInit(): void {
    (window as any).fbAsyncInit = function() {
      FB.init({
        appId      : '327118671669396',
        cookie     : true,
        xfbml      : true,
        version    : 'v8.0'
      });
        
      FB.AppEvents.logPageView();   
        
    };

    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  ngAfterViewInit() {
    this.getFBLoginStatus();
  }

  linkFacebook() {
    this.fbloading = true;
    FB.login((response) => {
      console.log('submitLogin',response);
      if (response.authResponse) {
        this.fbloading = false;
        this.fbAccountLinkStatus = true;
        this.getFacebookFriends(response.authResponse);
        console.log('authResponse',response.authResponse);
        //login success
        //login success code here
        //redirect to home page
      } else {
      console.log('User login failed');
      this.fbloading = false;
      }
    });
  }

  unlinkFacebook() {
    let self = this;
    this.fbloading = true;
    FB.logout(function(response) {
      self.fbAccountLinkStatus = false;
      self.fbloading = false;
      console.log('Facebook account unlinked', response);
    });
  }

  getFBLoginStatus() {
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        this.fbAccountLinkStatus = true;
        console.log('getFBLoginStatus method setting true');
        // The user is logged in and has authenticated your
        // app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed
        // request, and the time the access token 
        // and signed request each expire.
        var uid = response.authResponse.userID;
        var accessToken = response.authResponse.accessToken;
      } else if (response.status === 'not_authorized') {
        // The user hasn't authorized your application.  They
        // must click the Login button, or you must call FB.login
        // in response to a user gesture, to launch a login dialog.
      } else {
        // The user isn't logged in to Facebook. You can launch a
        // login dialog with a user gesture, but the user may have
        // to log in to Facebook before authorizing your application.
      }
     });
  }

  getFacebookFriends(authtResponse) {
    FB.api(
      `/${authtResponse.userID}/friends`,
      'GET',
      {},
      function(response) {
        console.log('facebook friends', response);
        if(response.data) {
          this.userFirendsList = response.data;
        }
      }
    );
  }

}
