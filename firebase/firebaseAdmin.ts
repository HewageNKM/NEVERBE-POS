import admin, {credential} from 'firebase-admin';
import {CartItem, Item} from "@/interfaces";

// Initialize Firebase Admin SDK if it hasn't been initialized already
if (!admin.apps.length) {
    admin.initializeApp({
        credential: credential.cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
    });
}

export const adminFirestore = admin.firestore();
export const adminAuth = admin.auth();

export const getUserById = async (uid: string) => {
    console.log(`Attempting to retrieve user with ID: ${uid}`);
    try {
        const user = await adminFirestore.collection('users').doc(uid).get();
        if (!user.exists) {
            console.warn(`User with ID ${uid} not found.`);
            new Error('User not found');
        }
        console.log(`User with ID ${uid} retrieved successfully.`);
        return user.data();
    } catch (error) {
        console.error(`Error retrieving user with ID ${uid}:`, error);
        throw error;
    }
};

export const getInventory = async (page: number = 1, size: number = 20) => {
    console.log("Attempting to retrieve inventory...");
    try {
        const offset = (page - 1) * size;
        const inventory = adminFirestore.collection('inventory');
        const snapshot = await inventory.limit(size).offset(offset).get();
        const inventoryData = snapshot.docs.map(doc => doc.data());
        const items: Item[] = []
        inventoryData.forEach(item => {
            items.push({
                ...item
            } as Item);
        });
        console.log("Inventory retrieved successfully:", inventoryData);
        return items;
    } catch (error) {
        console.error("Error retrieving inventory:", error);
        throw error;
    }
}

export const addItemToPosCart = async (item: CartItem) => {
    console.log("Attempting to add item to POS cart...");
    try {
        const documentReference = adminFirestore.collection("inventory").doc(item.itemId);
        const itemDoc = await documentReference.get();
        if (!itemDoc.exists) {
            console.warn(`Item with ID ${item.itemId} not found.`);
            throw new Error('Item not found');
        }

        const itemData = itemDoc.data() as Item;
        const variant = itemData.variants.find(variant => variant.variantId === item.variantId);
        if (!variant) {
            console.warn(`Variant with ID ${item.variantId} not found.`);
            throw new Error('Variant not found');
        }

        const size = variant?.sizes.find(size => size.size === item.size);
        if (!size) {
            console.warn(`Size ${item.size} not found.`);
            throw new Error('Size not found');
        }

        if (size.stock < item.quantity) {
            console.warn(`Insufficient stock. Requested: ${item.quantity}, Available: ${size.stock}`);
            throw Error("Insufficient Stock");
        }

        console.log(`Sufficient stock found. Deducted ${item.quantity} units from stock.`);

        // Update inventory
        const updatedVariants = itemData.variants.map(variant => {
            if (variant.variantId === item.variantId) {
                return {
                    ...variant,
                    sizes: variant.sizes.map(size => {
                        if (size.size === item.size) {
                            return {
                                ...size,
                                stock: size.stock - item.quantity
                            }
                        }
                        return size;
                    })
                }
            }
            return variant;
        });

        await documentReference.update({variants: updatedVariants});
        // Check if the item already exists in posCart
        const cartQuery = await adminFirestore
            .collection("posCart")
            .where("itemId", "==", item.itemId)
            .where("variantId", "==", item.variantId)
            .where("size", "==", item.size)
            .get();

        if (!cartQuery.empty) {
            // If the item exists, update the quantity
            const existingCartDoc = cartQuery.docs[0];
            const existingCartItem = existingCartDoc.data() as CartItem;

            const newQuantity = existingCartItem.quantity + item.quantity;

            await existingCartDoc.ref.update({quantity: newQuantity});
            console.log(`Updated quantity for existing cart item: New Quantity: ${newQuantity}`);
        } else {
            // If the item doesn't exist, add a new cart item
            await adminFirestore.collection("posCart").add(item);
            console.log("Item added to POS cart successfully:", item);
        }
        console.log("Item added to POS cart and inventory updated successfully:", item);
    } catch (error) {
        console.error("Error adding item to POS cart:", error);
        throw error;
    }
};

export const removeFromPostCart = async (item: CartItem) => {
    console.log("Attempting to remove item from POS cart...");
    try {
        const documentReference = adminFirestore.collection("inventory").doc(item.itemId);
        const itemDoc = await documentReference.get();
        if (!itemDoc.exists) {
            console.warn(`Item with ID ${item.itemId} not found.`);
            throw new Error('Item not found');
        }

        const itemData = itemDoc.data() as Item;
        const variant = itemData.variants.find(variant => variant.variantId === item.variantId);
        if (!variant) {
            console.warn(`Variant with ID ${item.variantId} not found.`);
            throw new Error('Variant not found');
        }

        const size = variant?.sizes.find(size => size.size === item.size);
        if (!size) {
            console.warn(`Size ${item.size} not found.`);
            throw new Error('Size not found');
        }

        // Update inventory
        const updatedVariants = itemData.variants.map(variant => {
            if (variant.variantId === item.variantId) {
                return {
                    ...variant,
                    sizes: variant.sizes.map(size => {
                        if (size.size === item.size) {
                            return {
                                ...size,
                                stock: size.stock + item.quantity
                            }
                        }
                        return size;
                    })
                }
            }
            return variant;
        });

        console.log("Checking for matching items in POS cart...");
        const querySnapshot = await adminFirestore.collection("posCart").get();

        const deletePromises = [];
        querySnapshot.forEach(doc => {
            const posCartItem = doc.data();
            if (posCartItem.itemId === item.itemId && posCartItem.variantId === item.variantId && posCartItem.size === item.size) {
                console.log(`Found matching item in POS cart. Deleting document ID: ${doc.id}`);
                deletePromises.push(doc.ref.delete());
            }
        });

        await adminFirestore.collection("inventory").doc(item.itemId).update({variants: updatedVariants});
        // Wait for all deletions to complete
        await Promise.all(deletePromises);
        console.log("Matching items removed from POS cart.");
        console.log("Item removed from POS cart and inventory updated successfully:", item);
    } catch (error) {
        console.error("Error removing item from POS cart:", error);
        throw error;
    }
};

export const verifyIdToken = async (token: string) => {
    console.log("Attempting to verify token...");
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        console.log("Token verification successful:", decodedToken);
        return decodedToken;
    } catch (error) {
        console.error("Token verification failed:", error);
        throw error;
    }
};
