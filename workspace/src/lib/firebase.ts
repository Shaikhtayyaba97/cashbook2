// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

//
// IMPORTANT: PASTE YOUR FIREBASE CONFIGURATION HERE
//
// You can get this from the Firebase Console:
// Project settings > General > Your apps > Web app > SDK setup and configuration
//
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replace with your key
  authDomain: "YOUR_AUTH_DOMAIN", // Replace with your domain
  projectId: "YOUR_PROJECT_ID", // Replace with your ID
  storageBucket: "YOUR_STORAGE_BUCKET", // Replace with your bucket
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Replace with your sender ID
  appId: "YOUR_APP_ID" // Replace with your App ID
};

// This singleton pattern ensures Firebase is initialized only once.
const getFirebaseApp = (): FirebaseApp => {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }
  return getApp();
};

const app: FirebaseApp = getFirebaseApp();
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
