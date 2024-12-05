
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "3",
    appId: "",
    measurementId: ""
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage=getStorage();
export const db =getFirestore(app);