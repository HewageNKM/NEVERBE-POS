import { adminFirestore } from "@/firebase/firebaseAdmin";
import { Item } from "@/interfaces";

export const getInventory = async (page: number = 1, size: number = 20) => {
    console.log("Attempting to retrieve inventory...");
    try {
        const offset = (page - 1) * size;
        const inventory = adminFirestore.collection('inventory');
        const snapshot = await inventory.limit(size).offset(offset).where("status", "==", "Active").get();
        const inventoryData = snapshot.docs.map(doc => doc.data());
        const items: Item[] = []
        inventoryData.forEach(item => {
            items.push({
                ...item
            } as Item);
        });
        console.log("Inventory retrieved successfully", items.length);
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
        if (item.data().status !== 'Active') {
            console.warn(`Item with ID ${itemId} is not active.`);
            throw new Error('Item is not active');
        }

        items.push(item.data() as Item);
        return items;
    } catch (error) {
        console.error(`Error retrieving item with ID ${itemId}:`, error);
        throw error;
    }
}