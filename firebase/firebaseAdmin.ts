import admin, {credential} from 'firebase-admin';
import {CartItem, Item, Order, User} from "@/interfaces";
import {Timestamp} from "@firebase/firestore";
import {createHash} from "node:crypto";

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
            throw new Error('User not found');
        }

        const userData: User = user.data();
        if (userData.status !== 'Active') {
            console.warn(`User with ID ${uid} is not active.`);
            throw new Error('User is not active');
        }

        console.log(`User with ID ${uid} retrieved successfully.`);
        return user.data();
    } catch (error) {
        console.error(`Error retrieving user with ID ${uid}:`, error);
        throw error;
    }
};

export const addNewOrder = async (order: Order) => {
    console.log("Attempting to add new order Id:" + order.orderId);
    const db = adminFirestore
    try {
        const updatedOrder: Order = {
            ...order,
            createdAt: Timestamp.now(),
        }
        console.log(updatedOrder);
        await db.runTransaction(async (transaction) => {
            const ordersCollection = db.collection("orders");
            const orderRef = ordersCollection.doc(order.orderId);

            // Check if the order already exists
            const existingOrder = await transaction.get(orderRef);
            if (existingOrder.exists) {
                throw new Error(`Order with ID ${order.orderId} already exists.`);
            }
            // Add the new order to the collection
            transaction.set(orderRef, order);
        });

        console.log("New order added successfully.");

        // Delete all documents in the posCart collection
        const posCartSnapshot = await db.collection("posCart").get();
        if (!posCartSnapshot.empty) {
            const batch = db.batch();
            posCartSnapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });

            await batch.commit();
            console.log("All records from posCart collection deleted successfully.");
        } else {
            console.log("posCart collection is empty, no records to delete.");
        }
    } catch (error) {
        console.error("Error adding new order:", error);
        throw error;
    }
};

export const getAOrder = async (orderId: string) => {
    console.log(`Attempting to retrieve order with ID: ${orderId}`);
    try {
        const order = await adminFirestore.collection('orders').doc(orderId).get();
        if (!order.exists) {
            console.warn(`Order with ID ${orderId} not found.`);
            throw new Error('Order not found');
        }
        if(order.data()?.from !== 'Store'){
            console.warn(`Order with ID ${orderId} is not from Store.`);
            throw new Error('Order is not from Store');
        }
        console.log(`Order with ID ${orderId} retrieved successfully.`);
        return {
            ...order.data(),
            createdAt: new Date((order.data()?.createdAt as Timestamp).seconds * 1000).toLocaleString(),
        };
    } catch (error) {
        console.error(`Error retrieving order with ID ${orderId}:`, error);
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
export const getAItem = async (itemId: string) => {
    console.log(`Attempting to retrieve item with ID: ${itemId}`);
    try {
        const item = await adminFirestore.collection('inventory').doc(itemId).get();
        const items: Item[] = []
        if (!item.exists) {
            console.warn(`Item with ID ${itemId} not found.`);
            throw new Error('Item not found');
        }
        console.log(`Item with ID ${itemId} retrieved successfully.`);
        items.push(item.data() as Item);
        return items;
    } catch (error) {
        console.error(`Error retrieving item with ID ${itemId}:`, error);
        throw error;
    }
}
export const getPosCart = async () => {
    try {
        const posCartCollection = adminFirestore.collection("posCart");
        console.log("Attempting to retrieve POS cart...");
        const cartSnapshot = await posCartCollection.get();
        const cartData = cartSnapshot.docs.map(doc => doc.data() as CartItem);
        console.log("POS cart retrieved successfully:", cartData);
        return cartData;
    } catch (error) {
        console.error("Error retrieving POS cart:", error);
        throw error;
    }
}

export const addItemToPosCart = async (item: CartItem) => {
    console.log("Attempting to add item to POS cart...");
    const inventoryRef = adminFirestore.collection("inventory").doc(item.itemId);
    const posCartCollection = adminFirestore.collection("posCart");

    try {
        await adminFirestore.runTransaction(async (transaction) => {
            const itemDoc = await transaction.get(inventoryRef);

            if (!itemDoc.exists) {
                console.warn(`Item with ID ${item.itemId} not found.`);
                throw new Error("Item not found");
            }

            const itemData = itemDoc.data() as Item;
            const variant = itemData.variants.find(variant => variant.variantId === item.variantId);
            if (!variant) {
                console.warn(`Variant with ID ${item.variantId} not found.`);
                throw new Error("Variant not found");
            }

            const size = variant?.sizes.find(size => size.size === item.size);
            if (!size) {
                console.warn(`Size ${item.size} not found.`);
                throw new Error("Size not found");
            }

            if (size.stock < item.quantity) {
                console.warn(`Insufficient stock. Requested: ${item.quantity}, Available: ${size.stock}`);
                throw new Error("Insufficient stock");
            }

            // Deduct stock
            const updatedVariants = itemData.variants.map(variant => {
                if (variant.variantId === item.variantId) {
                    return {
                        ...variant,
                        sizes: variant.sizes.map(size => {
                            if (size.size === item.size) {
                                return {...size, stock: size.stock - item.quantity};
                            }
                            return size;
                        }),
                    };
                }
                return variant;
            });
            transaction.update(inventoryRef, {variants: updatedVariants});

            // Check for existing cart item
            const cartQuery = await posCartCollection
                .where("itemId", "==", item.itemId)
                .where("variantId", "==", item.variantId)
                .where("size", "==", item.size)
                .limit(1)
                .get();

            if (!cartQuery.empty) {
                // Update quantity of existing cart item
                const cartDoc = cartQuery.docs[0];
                const existingCartItem = cartDoc.data() as CartItem;
                transaction.update(cartDoc.ref, {
                    quantity: existingCartItem.quantity + item.quantity,
                });
                console.log(`Updated quantity for cart item. New Quantity: ${existingCartItem.quantity + item.quantity}`);
            } else {
                // Add new cart item
                transaction.create(posCartCollection.doc(), item);
                console.log("New item added to POS cart:", item);
            }
        });

        console.log("Item successfully added to POS cart and inventory updated.");
    } catch (error) {
        console.error("Error adding item to POS cart:", error.message);
        throw new Error(error.message);
    }
};


export const removeFromPosCart = async (item: CartItem) => {
    console.log("Attempting to remove item from POS cart...");
    const inventoryRef = adminFirestore.collection("inventory").doc(item.itemId);
    const posCartCollection = adminFirestore.collection("posCart");

    try {
        await adminFirestore.runTransaction(async (transaction) => {
            const itemDoc = await transaction.get(inventoryRef);

            if (!itemDoc.exists) {
                console.warn(`Item with ID ${item.itemId} not found.`);
                throw new Error("Item not found");
            }

            const itemData = itemDoc.data() as Item;
            const variant = itemData.variants.find(variant => variant.variantId === item.variantId);
            if (!variant) {
                console.warn(`Variant with ID ${item.variantId} not found.`);
                throw new Error("Variant not found");
            }

            const size = variant?.sizes.find(size => size.size === item.size);
            if (!size) {
                console.warn(`Size ${item.size} not found.`);
                throw new Error("Size not found");
            }

            // Restore stock
            const updatedVariants = itemData.variants.map(variant => {
                if (variant.variantId === item.variantId) {
                    return {
                        ...variant,
                        sizes: variant.sizes.map(size => {
                            if (size.size === item.size) {
                                return {...size, stock: size.stock + item.quantity};
                            }
                            return size;
                        }),
                    };
                }
                return variant;
            });
            transaction.update(inventoryRef, {variants: updatedVariants});

            // Delete matching cart items
            const cartQuery = await posCartCollection
                .where("itemId", "==", item.itemId)
                .where("variantId", "==", item.variantId)
                .where("size", "==", item.size)
                .limit(1)
                .get();

            if (!cartQuery.empty) {
                const cartDoc = cartQuery.docs[0];
                transaction.delete(cartDoc.ref);
                console.log(`Cart item deleted: ${cartDoc.id}`);
            } else {
                console.warn("No matching cart item found.");
            }
        });

        console.log("Item successfully removed from POS cart and inventory updated.");
    } catch (error) {
        console.error("Error removing item from POS cart:", error.message);
        throw new Error(error.message);
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

const hashPassword = (password: string): string => {
    const hash = createHash("sha256"); // Use a secure algorithm like SHA-256
    hash.update(password); // Add the password to the hash
    return hash.digest("hex"); // Return the hashed password as a hexadecimal string
};
export const authenticateUserPassword = async (user) => {
    console.log("Hash: " + hashPassword(user.password));
    try {
        const userRef = adminFirestore.collection('users').doc(user.uid);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            console.warn(`User with uid ${user.uid} not found.`);
            throw new Error('User not found');
        }
        const userData = userDoc.data();
        const password = hashPassword(user.password);
        if (userData.password !== password) {
            console.warn('Incorrect password');
            throw new Error('Incorrect password');
        }
        console.log('User authenticated successfully');
        return userData;
    } catch (error) {
        console.error('Error authenticating user:', error);
        throw error;
    }
}