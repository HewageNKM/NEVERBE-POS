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
            url: 'https://erp.neverbe.lk/api/v2/orders',
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