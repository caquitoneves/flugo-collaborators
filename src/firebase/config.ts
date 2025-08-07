// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvQRa4F29XeCAxtgc--Ehgehkn_U2Vrus",
  authDomain: "flugo-collaborators.firebaseapp.com",
  projectId: "flugo-collaborators",
  storageBucket: "flugo-collaborators.firebasestorage.app",
  messagingSenderId: "400617697710",
  appId: "1:400617697710:web:3828cbbd403e9ccc91583f",
  measurementId: "G-CZ688FHVBK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);