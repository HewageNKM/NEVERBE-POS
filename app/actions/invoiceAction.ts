import {CartItem} from "@/interfaces";
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