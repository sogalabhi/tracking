import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || process.env?.VITE_FIREBASE_API_KEY || "AIzaSy_YOUR_API_KEY_HERE",
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || "tracker-5cfd5.firebaseapp.com",
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || "tracker-5cfd5",
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || "tracker-5cfd5.firebasestorage.app",
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "40136714501",
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || "1:40136714501:web:tracker"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
