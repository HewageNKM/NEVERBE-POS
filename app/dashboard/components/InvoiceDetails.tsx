"use client"
import React from 'react';
import {Button} from "@/components/ui/button";
import {useAppSelector} from "@/lib/hooks";
import Profile from "@/components/Profile";
import LiveClock from "@/components/LiveClock";

const InvoiceDetails = () => {
    const {items} = useAppSelector(state => state.invoice);

    return (
        <div className="flex py-4 px-2 relative items-center w-full min-h-[93vh] col-span-2 flex-col">
            <div className="flex flex-col w-full gap-5">
                <div className="flex-row flex items-center justify-between w-full">
                    <Profile/>
                    <LiveClock/>
                </div>
                <div className="flex justify-end ">
                    <h1 className="text-xl font-bold">Invoices:0</h1>
                </div>
            </div>
            <h1 className="text-2xl font-bold">Invoice Details</h1>
            <div className="mt-10 w-full flex flex-col">
                <div className="border-t-2 w-full"/>
            </div>
            <div className="w-full flex flex-col bottom-2 px-2 absolute">
                <div className="border-t-2 w-full"/>
                <div className="flex flex-col gap-1 mt-5">
                    <div className="flex justify-between">
                        <span className="text-lg text-gray-500 font-medium">Subtotal</span>
                        <span className="text-lg text-blue-700 font-medium">LKR 0</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-lg text-gray-500 font-medium">Discount</span>
                        <span className="text-lg text-blue-700 font-medium">LKR 0</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-lg text-gray-500 font-medium">Total</span>
                        <span className="text-lg text-blue-700 font-medium">LKR 0</span>
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