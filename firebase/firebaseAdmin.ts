import admin, {credential} from 'firebase-admin';
import {Item} from "@/interfaces";

// Initialize Firebase Admin SDK if it hasn't been initialized already
if (!admin.apps.length) {
    admin.initializeApp({
        credential: credential.cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
    });
}

export const adminFirestore = admin.firestore();
export const adminAuth = admin.auth();

export const getUserById = async (uid: string) => {
    console.log(`Attempting to retrieve user with ID: ${uid}`);
    try {
        const user = await adminFirestore.collection('users').doc(uid).get();
        if (!user.exists) {
            console.warn(`User with ID ${uid} not found.`);
            new Error('User not found');
        }
        console.log(`User with ID ${uid} retrieved successfully.`);
        return user.data();
    } catch (error) {
        console.error(`Error retrieving user with ID ${uid}:`, error);
        throw error;
    }
};

export const getInventory = async (page: number = 1, size: number = 20) => {
    console.log("Attempting to retrieve inventory...");
    try {
        const offset = (page - 1) * size;
        const inventory = adminFirestore.collection('inventory');
        const snapshot = await inventory.limit(size).offset(offset).get();
        const inventoryData = snapshot.docs.map(doc => doc.data());
        const items: Item[] = []
        inventoryData.forEach(item => {
            items.push({
                ...item
            } as Item);
        });
        console.log("Inventory retrieved successfully:", inventoryData);
        return items;
    } catch (error) {
        console.error("Error retrieving inventory:", error);
        throw error;
    }
}

export const verifyIdToken = async (token: string) => {
    console.log("Attempting to verify token...");
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        console.log("Token verification successful:", decodedToken);
        return decodedToken;
    } catch (error) {
        console.error("Token verification failed:", error);
        throw error;
    }
};
