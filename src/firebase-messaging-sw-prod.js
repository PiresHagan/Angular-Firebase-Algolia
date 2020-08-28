importScripts('https://www.gstatic.com/firebasejs/7.15.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.15.1/firebase-messaging.js');
firebase.initializeApp({
    apiKey: "AIzaSyBrkchwLnuHo6bqJzCYpENfSrg7Hfg2cDM",
    authDomain: "my-trending-stories-66f81.firebaseapp.com",
    databaseURL: "https://my-trending-stories-66f81.firebaseio.com",
    projectId: "my-trending-stories-66f81",
    storageBucket: "my-trending-stories-66f81.appspot.com",
    messagingSenderId: "172964785852",
    appId: "1:172964785852:web:2a5e84ca7c87db14cfeab9",
    measurementId: "G-HWMGQKQ8F1"
});

const messaging = firebase.messaging();