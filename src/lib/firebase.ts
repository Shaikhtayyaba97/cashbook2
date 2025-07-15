// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// IMPORTANT:
// PASTE YOUR FIREBASE CONFIGURATION HERE
// Replace the placeholder values with your actual Firebase project keys.
const firebaseConfig = {
  apiKey: "AIzaSyAxJ_Fy06wa8jRZOtOOZg365r1ve84Ri64",
  authDomain: "ledgerlite-83792.firebaseapp.com",
  projectId: "ledgerlite-83792",
  storageBucket: "ledgerlite-83792.firebasestorage.app",
  messagingSenderId: "77470769911",
  appId: "1:77470769911:web:698f3e91d48939e66429f2",
};


// Initialize Firebase for Singleton Pattern
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (getApps().length) {
  app = getApp();
} else {
  app = initializeApp(firebaseConfig);
}

auth = getAuth(app);
db = getFirestore(app);

export { app, auth, db };
