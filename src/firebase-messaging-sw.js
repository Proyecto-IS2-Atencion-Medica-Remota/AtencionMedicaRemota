importScripts('https://www.gstatic.com/firebasejs/7.17.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.17.1/firebase-messaging.js');
firebase.initializeApp({
    apiKey: "AIzaSyDkE-8_tx-z2ZIeHE2vMiOZx6YPGBB44FQ",
    authDomain: "atencionmedicaremota.firebaseapp.com",
    databaseURL: "https://atencionmedicaremota.firebaseio.com",
    projectId: "atencionmedicaremota",
    storageBucket: "atencionmedicaremota.appspot.com",
    messagingSenderId: "822753729696",
    appId: "1:822753729696:web:134ab796d57940744b3dc5"
});
const messaging = firebase.messaging();