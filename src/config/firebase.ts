// Firebase configuration
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAvZgE3Z9yu9if6Rof-kp04fDdWE9tCcj0",
  authDomain: "ecovoice-f89f2.firebaseapp.com",
  projectId: "ecovoice-f89f2",
  storageBucket: "ecovoice-f89f2.firebasestorage.app",
  messagingSenderId: "719132977474",
  appId: "1:719132977474:web:d8e7a8fd9d13294c7e80db",
  measurementId: "G-F2K8NWHESH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;