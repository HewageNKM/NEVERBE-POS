"use client";
import React, {useEffect} from "react";
import {Button} from "@/components/ui/button";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import Profile from "@/components/Profile";
import LiveClock from "@/components/LiveClock";
import CartItemCard from "@/app/dashboard/components/CartItemCard";
import {collection, onSnapshot} from "@firebase/firestore";
import {firestore} from "@/firebase/firebaseClient";
import {CartItem} from "@/interfaces";
import {ScrollArea} from "@/components/ui/scroll-area";
import {setItems} from "@/lib/invoiceSlice/invoiceSlice";
import LoadingScreen from "@/components/LoadingScreen";

const InvoiceDetails = () => {
    const {items,isInvoiceLoading} = useAppSelector((state) => state.invoice);
    const dispatch = useAppDispatch();

    const {user} = useAppSelector((state) => state.auth);
    // Calculate totals
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discount = 0;
    const total = subtotal - discount;

    useEffect(() => {
        if (user) {
            const unsubscribe = onSnapshot(collection(firestore, "posCart"), (snapshot) => {
                const data = snapshot.docs.map((doc) => doc.data() as CartItem);
                dispatch(setItems(data));
            });
            return () => unsubscribe();
        }
    }, [user]);

    return (
        <div className="flex pt-1 px-2 relative items-center w-full min-h-[93vh] col-span-2 flex-col">
            <div className="flex flex-col w-full gap-5">
                <div className="flex-row flex items-center justify-between w-full">
                    <Profile/>
                    <LiveClock/>
                </div>
            </div>
            <h1 className="text-2xl font-bold mt-5">Invoice Details</h1>
            <div className="mt-2 w-full flex flex-col">
                <div className="flex justify-end">
                    <h1 className="text-lg font-bold">Invoices: 0</h1>
                </div>
                <div className="border-t-2 w-full"/>
            </div>
            <ScrollArea className="w-full flex flex-col gap-2 relative min-h-[50vh]">
                {items.map((item, index) => (
                    <CartItemCard key={index} item={item}/>
                ))}
                {isInvoiceLoading &&(<LoadingScreen type={"component"}/>)}
            </ScrollArea>
            <div className="w-full flex flex-col bottom-2 px-2 absolute">
                <div className="border-t-2 w-full"/>
                <div className="flex flex-col gap-1 mt-5">
                    <div className="flex justify-between">
                        <span className="text-lg text-gray-500 font-medium">Subtotal</span>
                        <span className="text-lg text-blue-700 font-medium">
              LKR {subtotal.toFixed(2)}
            </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-lg text-gray-500 font-medium">Discount</span>
                        <span className="text-lg text-blue-700 font-medium">
              LKR {discount.toFixed(2)}
            </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-lg text-gray-500 font-medium">Total</span>
                        <span className="text-lg text-blue-700 font-medium">
              LKR {total.toFixed(2)}
            </span>
                    </div>
                </div>
                <Button className="w-full mt-2 text-lg font-medium">
                    Place Order
                </Button>
            </div>
        </div>
    );
};

export default InvoiceDetails;
