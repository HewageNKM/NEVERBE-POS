"use client"
import {getApp, getApps, initializeApp} from "firebase/app";
import {getAnalytics, isSupported} from "@firebase/analytics";
import {getAuth} from "firebase/auth";
import {collection, getDocs, getFirestore} from "@firebase/firestore";
import {CartItem} from "@/interfaces";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const clientApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(clientApp);
export const db = getFirestore(clientApp);
export const firestore = getFirestore(clientApp);
let analytics;
isSupported().then((supported) => {
    if (supported) {
        analytics = getAnalytics(clientApp);
    }
}).catch((error) => {
    console.error("Analytics not supported:", error);
});


export const getPosCart = async () => {
    try {
        const posCartCollection = collection(firestore, "posCart");
        console.log("Attempting to retrieve POS cart...");
        const cartSnapshot = await getDocs(posCartCollection);
        const cartData = cartSnapshot.docs.map(doc => doc.data() as CartItem);
        console.log("POS cart retrieved successfully:", cartData);
        return cartData;
    } catch (error) {
        console.error("Error retrieving POS cart:", error);
        throw error;
    }
}
