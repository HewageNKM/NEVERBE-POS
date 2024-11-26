"use client"
import {signInWithEmailAndPassword} from "@firebase/auth";
import {auth} from "@/firebase/firebaseClient";
import axios from "axios";

export const authenticateUser = async (email: string, password: string) => {
    try {
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
    } catch (e) {
        throw e;
    }
}

export const isUserExists = async (uid: string) => {
    try {
        const token = await auth.currentUser?.getIdToken();
        const response = await axios({
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            },
            url: `/api/v1/users/${uid}`,
        });
        return response.status === 200 ? response.data : null;
    } catch (e) {
        throw e;
    }
}

export const authenticatePassword = async (password: string) => {
    try {
        const token = await auth.currentUser?.getIdToken();
        const uid = auth.currentUser?.uid;

        const ob = {
            password: password,
            uid: uid
        }
        const response = await axios({
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            url: `/api/v1/users`,
            data: JSON.stringify(ob)
        });
        return response.status === 200 ? response.data : null;
    } catch (e) {
        throw e;
    }
}