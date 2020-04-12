import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { } from '@types/gapi';

//declare var gapi: any;

@Component({
  selector: 'app-article-single',
  templateUrl: './article-single.component.html',
  styleUrls: ['./article-single.component.scss']
})
export class ArticleSingleComponent implements OnInit {

  loading = true;
  authConfig:any;

  commentListData = [
    {
        name: 'Lillian Stone',
        img: 'assets/images/avatars/thumb-8.jpg',
        date: '6 hours ago.',
        likes: 43,
        comment: 'The palatable sensation we lovingly refer to as The Cheeseburger has a distinguished and illustrious history. It was born from humble roots, only to rise to well-seasoned greatness.'
    },
    {
        name: 'Victor Terry',
        img: 'assets/images/avatars/thumb-9.jpg',
        date: '8 hours ago.',
        likes: 18,
        comment: 'The palatable sensation we lovingly refer to as The Cheeseburger has a distinguished and illustrious history. It was born from humble roots, only to rise to well-seasoned greatness.'
    },
    {
        name: 'Wilma Young',
        img: 'assets/images/avatars/thumb-10.jpg',
        date: '2 days ago.',
        likes: 95,
        comment: 'The palatable sensation we lovingly refer to as The Cheeseburger has a distinguished and illustrious history. It was born from humble roots, only to rise to well-seasoned greatness.'
    }
  ]

  constructor(private http: HttpClient) { 
  }

  ngOnInit() {
    this.authConfig = {
      client_id: '446215367606-r13ej4iu38kuhnov46lq1t9mt8rrei21.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/contacts.readonly'
    };
  }

  /* googleContacts() {
    gapi.client.setApiKey('ZpLs1TuyL7HUhjvJtuu8AvP-');
    gapi.auth2.authorize(this.authConfig, this.handleAuthorization);
  }
  
  handleAuthorization = (authorizationResult) => {
    if (authorizationResult && !authorizationResult.error) {
      let url: string = "https://www.google.com/m8/feeds/contacts/default/thin?" +
         "alt=json&max-results=500&v=3.0&access_token=" +
         authorizationResult.access_token;
      console.log("Authorization success, URL: ", url);
      this.http.get<any>(url)
        .subscribe(
          response => {
            if (response.feed && response.feed.entry) {
              console.log(response.feed.entry);
            }
          }
        )
    }
  } */

}
