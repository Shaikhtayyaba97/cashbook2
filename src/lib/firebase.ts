// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// IMPORTANT:
// Your Firebase configuration is below.
// This file is in .gitignore, so your keys will NOT be stored in git.

const firebaseConfig = {
  apiKey: "AIzaSyC10T9s-aawj92Ncq7T_2-LzQgRDaT2pXQ",
  authDomain: "ledgerlite-fb-app.firebaseapp.com",
  projectId: "ledgerlite-fb-app",
  storageBucket: "ledgerlite-fb-app.appspot.com",
  messagingSenderId: "37482313663",
  appId: "1:37482313663:web:0d0b0b8c3a1b2c3d4e5f6a"
};


// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
