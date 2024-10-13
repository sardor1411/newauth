import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

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
const db1 = getFirestore(app);
const storage1 = getStorage(app);
const auth1 = getAuth(app);

export { db1, storage1, auth1 };
