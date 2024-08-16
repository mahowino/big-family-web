// lib/firebaseConfig.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCw7nrHcCAylGUcQmXWpIChsnxaRlq6X90",
  authDomain: "bigfamkenya-19cab.firebaseapp.com",
  projectId: "bigfamkenya-19cab",
  storageBucket: "bigfamkenya-19cab.appspot.com",
  messagingSenderId: "1033259609336",
  appId: "1:1033259609336:web:50b029a94c2babdfca9f0d",
  measurementId: "G-CWRDD34CW5",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { db, auth, app };
