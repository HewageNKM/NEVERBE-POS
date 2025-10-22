import { adminFirestore } from "@/firebase/firebaseAdmin";
import { Order } from "@/interfaces";
import { log } from "console";
import admin from "firebase-admin";


// ================================
// 🔹 ORDER OPERATIONS
// ================================
export const addNewOrder = async (order: Order) => {
  if (!order?.orderId) throw new Error("Invalid order payload");

  const orderRef = adminFirestore.collection("orders").doc(order.orderId);

  return adminFirestore.runTransaction(async (tx) => {
    const existing = await tx.get(orderRef);
    if (existing.exists) throw new Error(`Order ${order.orderId} already exists`);

    tx.set(orderRef, {
      ...order,
      createdAt: admin.firestore.Timestamp.fromDate(new Date(order.createdAt)),
    });
  })
    .then(async () => {
      // ✅ Efficiently clear posCart using batch delete
      const posCartSnap = await adminFirestore.collection("posCart").get();
      if (!posCartSnap.empty) {
        const batch = adminFirestore.batch();
        posCartSnap.docs.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
      }
      log("Order added & POS cart cleared");
    })
    .catch((e) => {
      console.error("addNewOrder failed:", e);
      throw e;
    });
};

export const getAOrder = async (orderId: string): Promise<Order> => {
  const doc = await adminFirestore.collection("orders").doc(orderId).get();
  if (!doc.exists) throw new Error("Order not found");

  const data = doc.data() as Order;
  if (data.from !== "Store") throw new Error("Order not from Store");

  return { ...data, createdAt: data.createdAt.toDate().toLocaleString() };
};