import { auth } from "@/firebase/firebaseClient"
import axios from "axios";

export const getInventory = async (page:number,size:number) => {
    const token = await auth.currentUser?.getIdToken();

    const response = await axios({
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        },
        url: `/api/v1/inventory?page=${page}&size=${size}`,
    });
    return response.data;
}