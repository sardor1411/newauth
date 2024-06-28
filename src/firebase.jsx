import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage'; // Firebase Storage'ni import qilish

const firebaseConfig = {
  apiKey: "AIzaSyBSh7AoUBcBsFhUJSGQnExzSiXK0HC0bRk",
  authDomain: "test-a00e1.firebaseapp.com",
  projectId: "test-a00e1",
  storageBucket: "test-a00e1.appspot.com",
  messagingSenderId: "541834212267",
  appId: "1:541834212267:web:ee81839aa805f3f11c98ee",
  measurementId: "G-0VFQE6JJDV"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app); // Firebase Storage'ni eksport qilish
