// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// IMPORTANT:
// Your Firebase configuration is below.
// This file is in .gitignore, so your keys will NOT be stored in git.

const firebaseConfig = {
  apiKey: "AIzaSyA2xq5k_a1Z-rQ8_P0V-TqN4yZ-U8A-j7s",
  authDomain: "ledgerlite-app.firebaseapp.com",
  projectId: "ledgerlite-app",
  storageBucket: "ledgerlite-app.appspot.com",
  messagingSenderId: "1008272115682",
  appId: "1:1008272115682:web:1e5f2e3a4b6c8d7e6f5a43"
};


// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
