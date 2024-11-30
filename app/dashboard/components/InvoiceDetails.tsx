"use client";
import React, {useEffect} from "react";
import {Button} from "@/components/ui/button";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import Profile from "@/components/Profile";
import LiveClock from "@/components/LiveClock";
import CartItemCard from "@/app/dashboard/components/CartItemCard";
import {ScrollArea} from "@/components/ui/scroll-area";
import LoadingScreen from "@/components/LoadingScreen";
import {getPosCartItems, setShowPaymentDialog} from "@/lib/invoiceSlice/invoiceSlice";
import PaymentForm from "@/app/dashboard/components/PaymentForm";
import InvoicePreview from "@/app/dashboard/components/PreviewInvoice";

const InvoiceDetails = () => {
    const {
        items,
        isInvoiceLoading,
        showPaymentDialog,
        invoiceId,
    } = useAppSelector((state) => state.invoice);
    const dispatch = useAppDispatch();
    const {user} = useAppSelector((state) => state.auth);

    // Calculate totals
    const subtotal = items?.reduce((acc, item) => acc + ( item.quantity * (item.price - (item.discount * item.price / 100))), 0);
    const total = subtotal;

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [dispatch, user]);

    const fetchData = () => {
        try {
            dispatch(getPosCartItems());
        } catch (e) {
            console.error(e);
        }
    }
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
                <div className="flex justify-between">
                    <h2 className="text-lg font-bold">Invoice #: <span className="uppercase">{invoiceId}</span></h2>
                    <h2 className="text-lg font-bold">Invoices: 0</h2>
                </div>
                <div className="border-t-2 w-full"/>
            </div>
            <ScrollArea className="w-full flex flex-col gap-2 relative min-h-[50vh]">
                {items.map((item, index) => (
                    <CartItemCard key={index} item={item}/>
                ))}
                {isInvoiceLoading && (<LoadingScreen type={"component"}/>)}
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
              LKR 0.00
            </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-lg text-gray-500 font-medium">Total</span>
                        <span className="text-lg text-blue-700 font-medium">
              LKR {total.toFixed(2)}
            </span>
                    </div>
                </div>
                <Button onClick={() => dispatch(setShowPaymentDialog(true))} disabled={items.length == 0}
                        className="w-full mt-2 text-lg disabled:cursor-not-allowed disabled:bg-opacity-60 font-medium">
                    Place Order
                </Button>
            </div>
            {showPaymentDialog && (<PaymentForm />)}
            <InvoicePreview />
        </div>
    );
};

export default InvoiceDetails;
