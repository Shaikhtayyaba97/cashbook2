// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// =================================================================================
// IMPORTANT: PASTE YOUR FIREBASE CONFIGURATION HERE
// =================================================================================
// 1. Go to your Firebase project console.
// 2. Go to Project settings (Gear icon).
// 3. In the "Your apps" card, select your web app.
// 4. Choose "Config" for SDK setup.
// 5. Copy the entire 'firebaseConfig' object and paste it below, replacing the placeholder.
//
const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_AUTH_DOMAIN_HERE",
  projectId: "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket: "PASTE_YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "PASTE_YOUR_APP_ID_HERE"
};
// =================================================================================


// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
