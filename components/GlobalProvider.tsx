"use client"
import React, {ReactNode, useEffect} from 'react';
import {onAuthStateChanged} from "@firebase/auth";
import {auth} from "@/firebase/firebaseClient";
import {isUserExists} from "@/app/actions/loginAction";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {setUser} from "@/lib/authSlice/authSlice";
import {User} from "@/interfaces";
import {RootState} from "@/lib/store";
import {useRouter} from "next/navigation";

const GlobalProvider = ({children}: { children: ReactNode }) => {
    const dispatch = useAppDispatch();
    const authUser = useAppSelector((state: RootState) => state.auth.user);
    const router = useRouter();

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            try {
                if (user) {
                    const usr = await isUserExists(user.uid);
                    if (usr) {
                        dispatch(setUser(usr as User));
                    }
                }
            } catch (e) {
                console.error(e);
            }
        })
    }, [])

    useEffect(() => {
        try {
            if (!authUser) {
                router.replace('/');
            }
        } catch (e) {
            console.error(e);
        }
    }, [authUser, dispatch, router]);
    return (
        <>
            {children}
        </>
    );
};

export default GlobalProvider;