import { adminFirestore } from "@/firebase/firebaseAdmin";
import crypto from "crypto";
import { FieldValue } from "firebase-admin/firestore";
import stringify from "json-stable-stringify";

const HASH_SECRET = process.env.HASH_SECRET;

const generateDocumentHash = (docData: any) => {
  const dataToHash = { ...docData };
  const canonicalString = stringify(dataToHash);
  const hashingString = `${canonicalString}${HASH_SECRET}`;
  return crypto.createHash("sha256").update(hashingString).digest("hex");
};

export const updateOrAddOrderHash = async (data: any) => {
  try {
    const cleanData = { ...data };
    const hashValue = generateDocumentHash(cleanData);
    const ledgerId = `hash_${data.orderId}`;

    await adminFirestore.collection("hash_ledger").doc(ledgerId).set(
      {
        id: ledgerId,
        hashValue,
        sourceCollection: "orders",
        sourceDocId: data.orderId,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    console.log(`Hash ledger updated for: ${ledgerId}`);
  } catch (error) {
    console.error("Failed to create hash:", error);
    throw error;
  }
};
