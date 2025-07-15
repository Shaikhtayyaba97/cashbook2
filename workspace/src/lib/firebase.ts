// src/lib/firebase.ts
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

//
// IMPORTANT: PASTE YOUR FIREBASE CONFIGURATION HERE
//
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replace with your key
  authDomain: "YOUR_AUTH_DOMAIN", // Replace with your domain
  projectId: "YOUR_PROJECT_ID", // Replace with your ID
  storageBucket: "YOUR_STORAGE_BUCKET", // Replace with your bucket
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Replace with your sender ID
  appId: "YOUR_APP_ID" // Replace with your App ID
};


// Initialize Firebase
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
