import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC8Df6e_TXIk6kQRVaNppZft6Mzmv9mYDA",
    authDomain: "house-marketplace-app-ade26.firebaseapp.com",
    projectId: "house-marketplace-app-ade26",
    storageBucket: "house-marketplace-app-ade26.appspot.com",
    messagingSenderId: "276262009018"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();