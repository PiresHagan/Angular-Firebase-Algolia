import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
declare var FB: any;

@Component({
  selector: 'app-link-social-account',
  templateUrl: './link-social-account.component.html',
  styleUrls: ['./link-social-account.component.scss']
})

export class LinkSocialAccountComponent implements OnInit {

  isLoaded: boolean = false;
  fbloading: boolean = false;
  fbAccountLinkStatus: boolean = false;
  userFirendsList = [];

  constructor( 
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    (window as any).fbAsyncInit = function() {
      FB.init({
        appId      : environment.facebook.appId,
        cookie     : true,
        xfbml      : true,
        version    : environment.facebook.version
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

  ngAfterViewChecked(): void {
    if (!this.isLoaded) {
      delete window['addthis']
      setTimeout(() => { this.loadScript(); }, 100);
      this.isLoaded = true;
    }
  }

  loadScript() {
    let node = document.createElement('script');
    node.src = environment.addThisScript;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  linkFacebook() {
    this.fbloading = true;
    FB.login((response) => {
      if (response.authResponse) {
        this.fbloading = false;
        this.fbAccountLinkStatus = true;
        this.getFacebookFriends();
      } else {
      // console.log('User login failed');
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
      // console.log('Facebook account unlinked', response);
    });
  }

  getFBLoginStatus() {
    let self = this;
    FB.getLoginStatus(function(response) {
      self.statusChangeCallback(response);
    });
  }

  statusChangeCallback(response) {
    if (response.status === 'connected') {
      this.fbAccountLinkStatus = true;
      this.getFacebookFriends();
    }
  }

  getFacebookFriends() {
    FB.api(
      `/me/friends`,
      'GET',
      {},
      function(response) {
        if(response.data) {
          this.userFirendsList = response.data;
        }
      }
    );
  }

}
