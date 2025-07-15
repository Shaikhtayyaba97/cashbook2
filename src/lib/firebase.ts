// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// =================================================================================
// TODO: PASTE YOUR FIREBASE CONFIGURATION OBJECT HERE
//
// You can get this from the Firebase console. In your project's settings,
// scroll down to the "Your apps" section and copy the `firebaseConfig` object.
// =================================================================================

const firebaseConfig = {
  // apiKey: "PASTE_YOUR_API_KEY_HERE",
  // authDomain: "PASTE_YOUR_AUTH_DOMAIN_HERE",
  // projectId: "PASTE_YOUR_PROJECT_ID_HERE",
  // storageBucket: "PASTE_YOUR_STORAGE_BUCKET_HERE",
  // messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID_HERE",
  // appId: "PASTE_YOUR_APP_ID_HERE"
};


// Initialize Firebase
// The following code checks if the configuration has been filled out.
let app, auth, db;
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "PASTE_YOUR_API_KEY_HERE") {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
} else {
    console.warn("Firebase configuration is missing. Please update src/lib/firebase.ts");
    // Provide dummy objects to prevent the app from crashing.
    app = {};
    auth = {};
    db = {};
}


export { app, auth, db };
