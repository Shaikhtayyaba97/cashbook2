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
  // apiKey: "AIzaSyAxJ_Fy06wa8jRZOtOOZg365r1ve84Ri64",
  // authDomain: "ledgerlite-83792.firebaseapp.com",
  // projectId: "ledgerlite-83792",
  // storageBucket: "ledgerlite-83792.firebasestorage.app",
  // messagingSenderId: "77470769911",
  // appId: "1:77470769911:web:698f3e91d48939e66429f2"
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
