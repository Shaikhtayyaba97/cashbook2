// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// IMPORTANT:
// Your Firebase configuration is below.
// This file is in .gitignore, so your keys will NOT be stored in git.

const firebaseConfig = {
  apiKey: "AIzaSyBoKHz6-5prkpltXQbka9WKpnzh6BvmMvA",
  authDomain: "cashbook-6531f.firebaseapp.com",
  projectId: "cashbook-6531f",
  storageBucket: "cashbook-6531f.appspot.com",
  messagingSenderId: "730218432910",
  appId: "1:730218432910:web:a7a61f598474d911fafcdf",
  measurementId: "G-RRT60JJ5GK"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
