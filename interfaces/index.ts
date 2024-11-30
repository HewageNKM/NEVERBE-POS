import {Timestamp} from "@firebase/firestore";

export interface Item {
    itemId: string,
    type: string,
    brand: string,
    thumbnail: {
        file: File | string,
        url: string,
    },
    variants: Variant[],
    manufacturer: string,
    status: "Active" | "Inactive",
    name: string,
    sellingPrice: number,
    discount: number,
}

export interface Payment {
    id: string;
    amount: number;
    paymentMethod: string;
}

export interface Size {
    size: string,
    stock: number,
}

export interface Variant {
    variantId: string,
    variantName: string,
    images: [{
        file: File | string,
        url: string,
    }],
    sizes: Size[],
}

export interface CartItem {
    itemId: string,
    variantId: string,
    name: string,
    variantName: string,
    thumbnail: string,
    size: string,
    discount: number,
    type: string,
    quantity: number,
    price: number,
}

export interface OrderItem {
    itemId: string,
    variantId: string,
    name: string,
    variantName: string,
    size: string,
    quantity: number,
    price: number,
    discount: number,
}

export interface Order {
    orderId: string,
    paymentId: string,
    items: OrderItem[],
    paymentStatus: string,
    paymentMethod: string,
    shippingCost: number,
    from: string,
    createdAt?: string | Timestamp;
}

export interface User {
    email: string,
    username: string,
    role: string,
    status: string,
    imageUrl: string,
}