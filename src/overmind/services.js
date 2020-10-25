import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FB_APIKEY,
  authDomain: `${process.env.REACT_APP_FB_ID}.firebaseapp.com`,
  databaseURL: `https://${process.env.REACT_APP_FB_ID}.firebaseio.com`,
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.database();
