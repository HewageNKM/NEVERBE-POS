import admin, { credential } from "firebase-admin";

// ================================
// 🔹 Initialize Firebase Admin Once
// ================================
if (!admin.apps.length) {
  admin.initializeApp({
    credential: credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

export const adminFirestore = admin.firestore();
export const adminAuth = admin.auth();