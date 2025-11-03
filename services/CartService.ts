// ================================
// 🔹 POS CART OPERATIONS

import { adminFirestore } from "@/firebase/firebaseAdmin";
import { CartItem } from "@/interfaces";
import { Product } from "@/interfaces/Product";

// ================================
export const getPosCart = async (): Promise<CartItem[]> => {
  const snap = await adminFirestore.collection("posCart").get();
  return snap.docs.map((d) => d.data() as CartItem);
};

export const addItemToPosCart = async (item: CartItem) => {
  const inventoryRef = adminFirestore.collection("inventory").doc(item.itemId);
  const posCart = adminFirestore.collection("posCart");

  await adminFirestore.runTransaction(async (tx) => {
    const itemDoc = await tx.get(inventoryRef);
    if (!itemDoc.exists) throw new Error("Item not found");

    const itemData = itemDoc.data() as Product;
    const variant = itemData.variants.find(
      (v) => v.variantId === item.variantId
    );
    if (!variant) throw new Error("Variant not found");

    const size = variant.sizes.find((s) => s.size === item.size);
    if (!size) throw new Error("Size not found");
    
    if (size.stock < item.quantity) {
      console.log("Not enough stock but moving forward");
    }

    // ✅ Deduct stock
    variant.sizes = variant.sizes.map((s) =>
      s.size === item.size ? { ...s, stock: s.stock - item.quantity } : s
    );

    const updatedVariants = itemData.variants.map((v) =>
      v.variantId === item.variantId ? variant : v
    );
    tx.update(inventoryRef, { variants: updatedVariants });

    // ✅ Add/update cart item
    const existing = await posCart
      .where("itemId", "==", item.itemId)
      .where("variantId", "==", item.variantId)
      .where("size", "==", item.size)
      .limit(1)
      .get();

    if (!existing.empty) {
      const ref = existing.docs[0].ref;
      const existingData = existing.docs[0].data() as CartItem;

      if (existingData.discount > 0)
        throw new Error("Item with discount exists. Remove first.");

      tx.update(ref, { quantity: existingData.quantity + item.quantity });
    } else {
      tx.set(posCart.doc(), { ...item, createdAt: new Date() });
    }
  });
};

export const removeFromPosCart = async (item: CartItem) => {
  const inventoryRef = adminFirestore.collection("inventory").doc(item.itemId);
  const posCart = adminFirestore.collection("posCart");

  await adminFirestore.runTransaction(async (tx) => {
    const itemDoc = await tx.get(inventoryRef);
    if (!itemDoc.exists) throw new Error("Item not found");

    const itemData = itemDoc.data() as Product;
    const variant = itemData.variants.find(
      (v) => v.variantId === item.variantId
    );
    if (!variant) throw new Error("Variant not found");

    // ✅ Restore stock
    variant.sizes = variant.sizes.map((s) =>
      s.size === item.size ? { ...s, stock: s.stock + item.quantity } : s
    );

    const updatedVariants = itemData.variants.map((v) =>
      v.variantId === item.variantId ? variant : v
    );
    tx.update(inventoryRef, { variants: updatedVariants });

    // ✅ Delete from cart
    const existing = await posCart
      .where("itemId", "==", item.itemId)
      .where("variantId", "==", item.variantId)
      .where("size", "==", item.size)
      .limit(1)
      .get();

    if (!existing.empty) tx.delete(existing.docs[0].ref);
  });
};
