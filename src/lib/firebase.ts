// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlJ6eNofAll_IYzDI1CdtczGcvosKrls0",
  authDomain: "gui12-52e03.firebaseapp.com",
  projectId: "gui12-52e03",
  storageBucket: "gui12-52e03.firebasestorage.app",
  messagingSenderId: "585134284385",
  appId: "1:585134284385:web:03ab917e9a538388c95420",
  measurementId: "G-W9MFY91F7H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Configure providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider, analytics };