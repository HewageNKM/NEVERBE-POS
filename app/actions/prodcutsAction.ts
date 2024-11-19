import { auth } from "@/firebase/firebaseClient"
import axios from "axios";

export const getInventory = async (page:number,size:number) => {
    const token = await auth.currentUser?.getIdToken();

    const response = await axios({
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
        },
        url: `/api/v1/inventory?page=${page}&size=${size}`,
    });
    return response.data;
}