// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdPupjN6iIZHOVK1NcqI-hrt_VEgA2T7g",
  authDomain: "pollamania-4a7ef.firebaseapp.com",
  projectId: "pollamania-4a7ef",
  storageBucket: "pollamania-4a7ef.appspot.com",
  messagingSenderId: "1738147394",
  appId: "1:1738147394:web:a0fb8286ad6c9baf2f0fdb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };