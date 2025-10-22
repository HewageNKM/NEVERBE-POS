import { adminAuth, adminFirestore } from "@/firebase/firebaseAdmin";
import { User } from "@/interfaces";
import { createHash } from "node:crypto";

// ================================
// 🔹 AUTHENTICATION
// ================================
export const verifyIdToken = async (token: string) => {
  try {
    return await adminAuth.verifyIdToken(token);
  } catch (e) {
    throw new Error("Invalid token");
  }
};

const hashPassword = (pwd: string) =>
  createHash("sha256").update(pwd).digest("hex");

export const authenticateUserPassword = async ({
  uid,
  password,
}: {
  uid: string;
  password: string;
}) => {
  const doc = await adminFirestore.collection("users").doc(uid).get();
  if (!doc.exists) throw new Error("User not found");

  const user = doc.data() as User;
  if (user.password !== hashPassword(password))
    throw new Error("Incorrect password");

  return user;
};
