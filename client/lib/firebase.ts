// lib/firebase.ts
import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";

// ✅ Your Firebase web config
const firebaseConfig = {
  apiKey: "AIzaSyCw554ISXXWTjUi0SssNsnSuP3QFkvyHz0",
  authDomain: "gymbratt-1d2c3.firebaseapp.com",
  projectId: "gymbratt-1d2c3",
  storageBucket: "gymbratt-1d2c3.firebasestorage.app",
  messagingSenderId: "1050001833280",
  appId: "1:1050001833280:web:8fc0ca10fa09bb38794ea5",
};

// ✅ Initialize app safely (avoid double init in Expo)
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// ✅ Simple Auth / Firestore / Storage setup
export const firebaseApp = app;
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
