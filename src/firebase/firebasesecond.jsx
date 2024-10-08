import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig3 = {
    apiKey: "AIzaSyArpJfG0tS6Q1bCNCmzgWBg6M4eXvy1oiw",
    authDomain: "zilolamediaworkerssecond.firebaseapp.com",
    projectId: "zilolamediaworkerssecond",
    storageBucket: "zilolamediaworkerssecond.appspot.com",
    messagingSenderId: "492884583982",
    appId: "1:492884583982:web:3df85287882a5e0f02a1bf",
    measurementId: "G-M23RBHJYYG"
};

const app3 = getApps().find(app => app.name === 'app3') || initializeApp(firebaseConfig3, 'app3');

export const db3 = getFirestore(app3);
export const auth3 = getAuth(app3);
export const storage3 = getStorage(app3);
