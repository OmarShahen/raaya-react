// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvIvdPadYeFlyYVUSu88xJzhNS53eOV1A",
  authDomain: "ra-aya.firebaseapp.com",
  projectId: "ra-aya",
  storageBucket: "ra-aya.appspot.com",
  messagingSenderId: "479245203312",
  appId: "1:479245203312:web:a7727ca23d2bd0a14901b5",
  measurementId: "G-58XFRY9P61"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

export const projectStorage = getStorage(app)
