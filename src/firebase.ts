import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCYQZr50RsGeBJ7zxb8Cm0dt6RDbVfYw38",
  authDomain: "coinkeeper-6302b.firebaseapp.com",
  projectId: "coinkeeper-6302b",
  storageBucket: "coinkeeper-6302b.firebasestorage.app",
  messagingSenderId: "891543827274",
  appId: "1:891543827274:web:da7095e8f1e97412d307b3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
