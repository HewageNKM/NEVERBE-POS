import React from 'react';
import {Button} from "@/components/ui/button";

const InvoiceDetails = () => {
    return (
        <div className="flex py-4 px-2 relative items-center w-full col-span-2 flex-col">
            <h1 className="text-2xl font-bold">Invoice Details</h1>
            <div className="mt-10 w-full flex flex-col">
                <div className="border-t-2 w-full"/>
                <div className="flex flex-col justify-between gap-1 mt-5">
                </div>
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