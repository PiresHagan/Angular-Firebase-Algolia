importScripts('https://www.gstatic.com/firebasejs/7.15.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.15.1/firebase-messaging.js');
firebase.initializeApp({
    apiKey: "AIzaSyC83ZSVEBAP_9tuNucpudqPzya8zNsYxL8",
    authDomain: "my-trending-stories-dev.firebaseapp.com",
    databaseURL: "https://my-trending-stories-dev.firebaseio.com",
    projectId: "my-trending-stories-dev",
    storageBucket: "my-trending-stories-dev.appspot.com",
    messagingSenderId: "446215367606",
    appId: "1:446215367606:web:8f9ef10855e88708c9af17",
    measurementId: "G-EY017BDB3Z"
});

const messaging = firebase.messaging();