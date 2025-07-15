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

// This function ensures Firebase is initialized only once
const getFirebaseApp = (): FirebaseApp => {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }
  return getApp();
};

const app = getFirebaseApp();

// Functions to get the auth and firestore services
// This "lazy" approach ensures the app is initialized before the services are used.
const getFirebaseAuth = (): Auth => getAuth(app);
const getFirebaseDb = (): Firestore => getFirestore(app);

export { app, getFirebaseAuth, getFirebaseDb };
