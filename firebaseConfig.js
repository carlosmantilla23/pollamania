import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Asegúrate de importarlo correctamente

const firebaseConfig = {
  apiKey: "AIzaSyCdPupjN6iIZHOVK1NcqI-hrt_VEgA2T7g",
  authDomain: "pollamania-4a7ef.firebaseapp.com",
  projectId: "pollamania-4a7ef",
  storageBucket: "pollamania-4a7ef.appspot.com",
  messagingSenderId: "1738147394",
  appId: "1:1738147394:web:a0fb8286ad6c9baf2f0fdb"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firebase Auth con persistencia usando AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Inicializar Firestore
const firestore = getFirestore(app);

export { app, auth, firestore };
