// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDL4c5RYHZnJOLQEG0s56y2V6DqEkktb7M",
  authDomain: "is-gesture-controlled.firebaseapp.com",
  projectId: "is-gesture-controlled",
  storageBucket: "is-gesture-controlled.firebasestorage.app",
  messagingSenderId: "31205139694",
  appId: "1:31205139694:web:0a6c9837736df5d77bffff"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app);
