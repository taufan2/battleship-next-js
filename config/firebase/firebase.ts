// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAVFjER03gLig5qvTmsvu2YOjQL1upPz2g",
    authDomain: "battleship-game-b0add.firebaseapp.com",
    projectId: "battleship-game-b0add",
    storageBucket: "battleship-game-b0add.appspot.com",
    messagingSenderId: "631020994412",
    appId: "1:631020994412:web:5e38bf16105381e3717d49",
    measurementId: "G-3VMNCNSEJ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const myFirestore = getFirestore(app);

export {myFirestore};