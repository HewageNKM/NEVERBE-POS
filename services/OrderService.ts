import { adminFirestore } from "@/firebase/firebaseAdmin";
import { Order } from "@/interfaces";
import admin from "firebase-admin";
import { updateOrAddOrderHash } from "./IntegrityService";

// ================================
// 🔹 ORDER OPERATIONS
// ================================
const clearPosCart = async () => {
  try {
    const snap = await adminFirestore.collection("posCart").get();
    if (snap.empty) return;
    const batch = adminFirestore.batch();
    snap.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    console.log("POS cart cleared");
  } catch (error) {
    console.error("clearPosCart failed:", error);
    throw error;
  }
};

export const addNewOrder = async (order: any) => {
  if (!order?.orderId) throw new Error("Invalid order payload");
  const orderRef = adminFirestore.collection("orders").doc(order.orderId);

  return adminFirestore
    .runTransaction(async (tx) => {
      tx.create(orderRef, {
        ...order,
        createdAt: admin.firestore.Timestamp.fromDate(
          new Date(order.createdAt)
        ),
      });
    })
    .then(async () => {
      const orderDoc = await orderRef.get();
      if (!orderDoc.exists) throw new Error("Order not found");
      const data = orderDoc.data();

      await Promise.all([clearPosCart(), updateOrAddOrderHash(data)]);
      console.log("Order added & POS cart cleared & hash stored");
    })
    .catch((e) => {
      console.error("addNewOrder failed:", e);
      throw e;
    });
};

export const getAOrder = async (orderId: string): Promise<Order> => {
  try {
    const doc = await adminFirestore.collection("orders").doc(orderId).get();
    if (!doc.exists) throw new Error("Order not found");

    const data = doc.data() as Order;
    if (data.from !== "Store") throw new Error("Order not from Store");

    return { ...data, createdAt: data.createdAt.toDate().toLocaleString() };
  } catch (error) {
    console.error("getAOrder failed:", error);
    throw error;
  }
};