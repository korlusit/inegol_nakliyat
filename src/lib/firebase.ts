// src/lib/firebase.ts

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// --- DİKKAT: AŞAĞIDAKİ KODLARI KENDİ KONSOLUNDAN ALDIKLARINLA DEĞİŞTİR ---
const firebaseConfig = {
  apiKey: "AIzaSyBej82iPd7SxrTp0e0sAPGA45NUbqqgklk",
  authDomain: "inegolnakliyat-bfbba.firebaseapp.com",
  projectId: "inegolnakliyat-bfbba",
  storageBucket: "inegolnakliyat-bfbba.firebasestorage.app",
  messagingSenderId: "707706185868",
  appId: "1:707706185868:web:8602b8021769a89032b3a9",
  measurementId: "G-KC3LKSQYQ8"
};

const app = initializeApp(firebaseConfig);

// Uygulamanın her yerinde kullanacağımız servisleri dışarı aktarıyoruz
export const db = getFirestore(app);
export const auth = getAuth(app);