import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyCAqcJqbLsH69NncWsJ6Z81Q-WtHPCKhLo",
  authDomain: "projectnom-8aa1d.firebaseapp.com",
  projectId: "projectnom-8aa1d",
  storageBucket: "projectnom-8aa1d.appspot.com",
  messagingSenderId: "958308622775",
  appId: "1:958308622775:web:c6c58c26403b7532504832",
  measurementId: "G-KMPV6Z0MC1",
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
