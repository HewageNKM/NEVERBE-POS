import axios from "axios";
import {auth} from "@/firebase/firebaseClient";

export const getPOSPaymentMethods = async () => {
    try {
        const token = await auth.currentUser?.getIdToken();

        const response = await axios({
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            },
            url: `/api/v1/payment-methods`,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}