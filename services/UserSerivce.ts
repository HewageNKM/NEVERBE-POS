import { adminFirestore } from "@/firebase/firebaseAdmin";
import { User } from "@/interfaces";
import { log } from "console";

// ================================
// 🔹 USER OPERATIONS
// ================================
export const getUserById = async (uid: string): Promise<User> => {
  log(`Fetching user: ${uid}`);
  const doc = await adminFirestore.collection("users").doc(uid).get();
  if (!doc.exists) throw new Error("User not found");

  const user = doc.data() as User;
  if (user.status !== "Active") throw new Error("User not active");
  return user;
};
