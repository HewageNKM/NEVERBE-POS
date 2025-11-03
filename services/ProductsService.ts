import { adminFirestore } from "@/firebase/firebaseAdmin";
import { Item } from "@/interfaces";
import { Product } from "@/interfaces/Product";

export const getProducts = async (
  page: number = 1,
  size: number = 20,
  stockId?: string
): Promise<Product[]> => {
  console.log("Attempting to retrieve inventory...");

  try {
    if (!stockId) return [];

    // 1️⃣ Fetch stock inventory items for the given stockId
    const stockSnapshot = await adminFirestore
      .collection("stock_inventory")
      .where("stockId", "==", stockId)
      .get();

    if (stockSnapshot.empty) {
      console.log("No inventory found for stockId:", stockId);
      return [];
    }

    // 2️⃣ Extract unique productIds
    const productIdsSet = new Set<string>();
    stockSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.productId) productIdsSet.add(data.productId);
    });

    const productIds = Array.from(productIdsSet);
    if (productIds.length === 0) return [];

    // 3️⃣ Pagination
    const offset = (page - 1) * size;
    const paginatedProductIds = productIds.slice(offset, offset + size);

    // 4️⃣ Fetch products from `products` collection
    const productsCollection = adminFirestore.collection("products");
    const productsSnapshot = await productsCollection
      .where("isDeleted", "==", false)
      .where("status", "==", true)
      .where("id", "in", paginatedProductIds)
      .get();

    const products: Product[] = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Product),
    }));

    console.log("Products retrieved:", products.length);
    return products;
  } catch (error) {
    console.error("Error retrieving inventory products:", error);
    throw error;
  }
};

export const getAItem = async (itemId: string) => {
  console.log(`Attempting to retrieve item with ID: ${itemId}`);
  try {
    const item = await adminFirestore.collection("inventory").doc(itemId).get();
    const items: Item[] = [];
    if (!item.exists) {
      console.warn(`Item with ID ${itemId} not found.`);
      throw new Error("Item not found");
    }
    console.log(`Item with ID ${itemId} retrieved successfully.`);
    if (item.data().status !== "Active") {
      console.warn(`Item with ID ${itemId} is not active.`);
      throw new Error("Item is not active");
    }

    items.push(item.data() as Item);
    return items;
  } catch (error) {
    console.error(`Error retrieving item with ID ${itemId}:`, error);
    throw error;
  }
};

export const getStockInventory = async (
  stockId: string,
  productId: string,
  variantId: string,
  size: string
) => {
  try {
    const stockSnapshot = await adminFirestore
      .collection("stock_inventory")
      .where("stockId", "==", stockId)
      .where("productId", "==", productId)
      .where("variantId", "==", variantId)
      .where("size", "==", size)
      .get();

    if (stockSnapshot.empty) {
      console.log("No inventory found for stockId:", stockId);
      return null;
    }
    return stockSnapshot.docs[0].data();
  } catch (erorr) {
    console.error(erorr);
    throw erorr;
  }
};
