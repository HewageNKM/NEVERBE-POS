import {Timestamp} from "@firebase/firestore";

export interface PaymentMethod {
    paymentId:string
    name: string
    status: string
    fee: number
    available: string[]
    createdAt: string | Timestamp
}

export interface Payment {
    id: string;
    amount: number;
    paymentMethodId:string,
    cardNumber:string,
    paymentMethod: string;
}

export interface Size {
    size: string,
    stock: number,
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
    bPrice: number,
}

export interface OrderItem {
    itemId: string,
    variantId: string,
    name: string,
    variantName: string,
    size: string,
    quantity: number,
    price: number,
    bPrice: number,
    discount: number,
}

export interface Order {
    orderId: string,
    paymentId?: string,
    items: OrderItem[],
    paymentStatus: string,
    paymentMethod: string,
    paymentMethodId?:string,
    discount: number,
    status:string,
    stockId:string,
    fee: number,
    total: number,
    transactionFeeCharge:number,
    shippingFee:number,
    paymentReceived?:Payment[]
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