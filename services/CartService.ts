// ================================
// 🔹 POS CART OPERATIONS

import { adminFirestore } from "@/firebase/firebaseAdmin";
import { CartItem } from "@/interfaces";
import { InventoryItem } from "@/interfaces/InventoryItem";
import { FieldValue } from "firebase-admin/firestore";

// ================================

// ✅ Get all items in POS cart
export const getPosCart = async (): Promise<CartItem[]> => {
  const snap = await adminFirestore.collection("posCart").get();
  return snap.docs.map((d) => d.data() as CartItem);
};

// ================================
// ✅ Add item to POS cart using InventoryItem info
export const addItemToPosCart = async (item: CartItem & { stockId: string }) => {
  const posCart = adminFirestore.collection("posCart");

  await adminFirestore.runTransaction(async (tx) => {
    // 1️⃣ Fetch inventory item using productId, variantId, size, stockId
    const inventoryQuery = await adminFirestore
      .collection("stock_inventory")
      .where("productId", "==", item.itemId)
      .where("variantId", "==", item.variantId)
      .where("size", "==", item.size)
      .where("stockId", "==", item.stockId)
      .limit(1)
      .get();

    if (inventoryQuery.empty) throw new Error("Item not found in inventory");

    const inventoryRef = inventoryQuery.docs[0].ref;
    const inventoryData = inventoryQuery.docs[0].data() as InventoryItem;

    // 2️⃣ Check if requested quantity is bigger than available
    if (item.quantity > inventoryData.quantity) {
      console.warn(
        `Warning: Requested quantity (${item.quantity}) is greater than available stock (${inventoryData.quantity}) for productId: ${item.itemId}, size: ${item.size}, stockId: ${item.stockId}`
      );
    }

    // 3️⃣ Deduct stock (allow negative)
    tx.update(inventoryRef, {
      quantity: inventoryData.quantity - item.quantity,
    });

    // 4️⃣ Add to POS cart
    tx.set(posCart.doc(), { ...item, createdAt: FieldValue.serverTimestamp() });
  });
};


// ================================
// ✅ Remove item from POS cart and restock
export const removeFromPosCart = async (item: CartItem & { stockId: string }) => {
  const posCart = adminFirestore.collection("posCart");

  await adminFirestore.runTransaction(async (tx) => {
    // 1️⃣ Fetch inventory item
    const inventoryQuery = await adminFirestore
      .collection("stock_inventory")
      .where("productId", "==", item.itemId)
      .where("variantId", "==", item.variantId)
      .where("size", "==", item.size)
      .where("stockId", "==", item.stockId)
      .limit(1)
      .get();

    if (inventoryQuery.empty) throw new Error("Item not found in inventory");

    const inventoryRef = inventoryQuery.docs[0].ref;
    const inventoryData = inventoryQuery.docs[0].data() as InventoryItem;

    // 2️⃣ Restore stock
    tx.update(inventoryRef, {
      quantity: inventoryData.quantity + item.quantity,
    });

    // 3️⃣ Delete item from POS cart
    const cartQuery = await posCart
      .where("itemId", "==", item.itemId)
      .where("variantId", "==", item.variantId)
      .where("size", "==", item.size)
      .where("stockId", "==", item.stockId)
      .limit(1)
      .get();

    if (!cartQuery.empty) {
      tx.delete(cartQuery.docs[0].ref);
    }
  });
};

