import { adminFirestore } from "@/firebase/firebaseAdmin";
import { Order } from "@/interfaces";
import { toSafeLocaleString } from "./UtilService";

export const getAOrder = async (orderId: string): Promise<Order> => {
  try {
    const doc = await adminFirestore.collection("orders").doc(orderId).get();
    if (!doc.exists) throw new Error("Order not found");

    const data = doc.data() as Order;
    if (data.from !== "Store") throw new Error("Order not from Store");

    return { ...data, createdAt: toSafeLocaleString(data.createdAt), updatedAt: toSafeLocaleString(data.updatedAt)};
  } catch (error) {
    console.error("getAOrder failed:", error);
    throw error;
  }
};