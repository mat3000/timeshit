import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyC9IZpvqiiCDgHyj-iByJ0WpyGuYDJ1NrY',
  authDomain: 'test-38810.firebaseapp.com',
  databaseURL: 'https://test-38810.firebaseio.com',
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.database();
