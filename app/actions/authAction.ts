"use client"
import {signInWithEmailAndPassword} from "@firebase/auth";
import {auth} from "@/firebase/firebaseClient";
import axios from "axios";

export const authenticateUser = async (email: string, password: string) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);

    if (credential.user) {
        const token = await credential.user.getIdToken();
        const response = await axios({
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            },
            url: `/api/v1/users/${credential.user.uid}`,
        });
        if (response.status === 200) {
            return {
                user: response.data
            }
        } else {
            new Error('Failed to fetch user data')
        }
    } else {
        new Error('Failed to authenticate user')
    }
}

export const isUserExists = async (uid: string) => {
    const token = await auth.currentUser?.getIdToken();
    const response = await axios({
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        },
        url: `/api/v1/users/${uid}`,
    });
    return response.status === 200 ? response.data : null;
}