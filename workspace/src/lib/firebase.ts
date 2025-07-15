// src/lib/firebase.ts
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

//
// IMPORTANT: PASTE YOUR FIREBASE CONFIGURATION HERE
//
const firebaseConfig = {
  apiKey: "AIzaSyAxJ_Fy06wa8jRZOtOOZg365r1ve84Ri64",
  authDomain: "ledgerlite-83792.firebaseapp.com",
  projectId: "ledgerlite-83792",
  storageBucket: "ledgerlite-83792.firebasestorage.app",
  messagingSenderId: "77470769911",
  appId: "1:77470769911:web:698f3e91d48939e66429f2",
};


// Initialize Firebase
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
