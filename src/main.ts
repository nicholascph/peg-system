import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppComponent, environment } from './app/';
import { FIREBASE_PROVIDERS, defaultFirebase ,firebaseAuthConfig} from 'angularfire2';

if (environment.production) {
  enableProdMode();
}

bootstrap(AppComponent, [
  FIREBASE_PROVIDERS,
  // Initialize Firebase app
  defaultFirebase({
    apiKey: "AIzaSyD2UTiFf7aoBKXKi_JwFikLGEJuEKxUbdI",
    authDomain: "badminton-peg.firebaseapp.com",
    databaseURL: "https://badminton-peg.firebaseio.com",
    storageBucket: "badminton-peg.appspot.com"
})
]);
