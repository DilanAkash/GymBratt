// lib/firebase.ts
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth, initializeAuth } from "firebase/auth";
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
let auth: Auth;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);

  // Try to initialize with persistence safely
  try {
    // Check if we can use the React Native persistence
    // This require might fail if the subpath isn't resolved, falling back to default
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getReactNativePersistence } = require("firebase/auth/react-native");

    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
    console.log("Firebase Auth initialized with persistence");
  } catch (e) {
    console.warn("Firebase Auth persistence failed to load, falling back to memory:", e);
    auth = getAuth(app);
  }
} else {
  app = getApp();
  auth = getAuth(app);
}

export const firebaseApp = app;
// @ts-ignore
export { auth };
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
