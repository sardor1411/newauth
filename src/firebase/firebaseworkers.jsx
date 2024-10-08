import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Ikkinchi Firebase konfiguratsiya
const firebaseConfig2 = {
  apiKey: "AIzaSyCDEPZN2cBGVETPAjH7GtlEv6qXjbFevmg",
  authDomain: "zilolamedia-worker.firebaseapp.com",
  projectId: "zilolamedia-worker",
  storageBucket: "zilolamedia-worker.appspot.com",
  messagingSenderId: "142501702872",
  appId: "1:142501702872:web:f1756230d2dc233860bbad",
  measurementId: "G-J8S8NFB9NY",
};

// Ilovani faqat bir marta boshlang
const app2 = getApps().find(app => app.name === 'app2') || initializeApp(firebaseConfig2, 'app2');

export const jb = getFirestore(app2);
export const auth2 = getAuth(app2);
export const storage2 = getStorage(app2);
