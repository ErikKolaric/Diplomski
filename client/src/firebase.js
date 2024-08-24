import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDYlXzhqUUlf0qrXJoxErTKCrqbd4etOsM",
  authDomain: "brandboost-acf2d.firebaseapp.com",
  projectId: "brandboost-acf2d",
  storageBucket: "brandboost-acf2d.appspot.com",
  messagingSenderId: "501408295232",
  appId: "1:501408295232:web:24c5d5f6860a659e6832a5",
  measurementId: "G-F314H3GJX6",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db, analytics };
