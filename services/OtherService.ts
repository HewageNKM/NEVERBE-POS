import { adminFirestore } from "@/firebase/firebaseAdmin";
import { PaymentMethod } from "@/interfaces";

// ================================
// 🔹 PAYMENT METHODS
// ================================
export const getAllPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const snap = await adminFirestore
    .collection("paymentMethods")
    .where("status", "==", "Active")
    .where("available", "array-contains", "Store")
    .get();

  return snap.docs.map(
    (d) =>
      ({
        paymentId: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate?.().toLocaleString(),
      } as PaymentMethod)
  );
};