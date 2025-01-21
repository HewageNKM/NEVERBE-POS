import {CartItem, Order} from "@/interfaces";
import axios from "axios";
import {auth} from "@/firebase/firebaseClient";


export const reserveItem = async (item: CartItem) => {
    try {
        const token = await auth.currentUser?.getIdToken();
        return await axios({
            method: 'POST',
            url: '/api/v1/poscart',
            data: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
    } catch (e) {
        throw e;
    }
}
export const releaseItem = async (item: CartItem) => {
    try {
        const token = await auth.currentUser?.getIdToken();
        const res = await axios({
            method: 'DELETE',
            url: '/api/v1/poscart',
            data: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        return res.status == 200;
    } catch (e) {
        throw e;
    }
}
export const getPosCart = async () => {
    try {
        const token = await auth.currentUser?.getIdToken();
        const res = await axios({
            method: 'GET',
            url: '/api/v1/poscart',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(res.data);
        return res.data;
    } catch (e) {
        throw e;
    }
}

export const addOrder = async (order: Order) => {
    try {
        const token = await auth.currentUser?.getIdToken();
        return await axios({
            method: 'POST',
            url: '/api/v1/orders',
            data: JSON.stringify(order),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
    } catch (e) {
        throw e
    }
}

export const getAOrder = async (orderId: string) => {
    try {
        const token = await auth.currentUser?.getIdToken();
        const res = await axios({
            method: 'GET',
            url: `/api/v1/orders/${orderId}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data as Order;
    } catch (e) {
        throw e;
    }
}

export const sendPrintInvoice = async (order: Order) => {
    console.log(order);
    try {
        const res = await axios({
            method: 'POST',
            url: `http://localhost:4444/api/v1/printer/print`,
            headers:{
                "Content-Type": "application/json"
            },
            data: JSON.stringify(order),
        });
        return res.data;
    } catch (e) {
        throw e;
    }
}
export const openDrawer = async()  => {
    try {
        const res = await axios({
            method: 'GET',
            url: `http://localhost:4444/api/v1/printer/drawer`,
        });
        return res.data;
    } catch (e) {
        throw e;
    }
}