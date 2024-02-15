import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyABeYFlSV6BBTzlFLBki_P9mnDHPAyTKgg",
    authDomain: "iahub-24.firebaseapp.com",
    projectId: "iahub-24",
    storageBucket: "iahub-24.appspot.com",
    messagingSenderId: "94561961233",
    appId: "1:94561961233:web:faac13f1f181ff7404f8b0",
    measurementId: "G-GG4SQD33NN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
