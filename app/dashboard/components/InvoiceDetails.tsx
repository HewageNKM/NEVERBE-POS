"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Profile from "@/components/Profile";
import CartItemCard from "@/app/dashboard/components/CartItemCard";
import LoadingScreen from "@/components/LoadingScreen";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import PaymentForm from "@/app/dashboard/components/PaymentForm";
import {
  getPosCartItems,
  setShowPaymentDialog,
} from "@/lib/invoiceSlice/invoiceSlice";
import { collection, onSnapshot, query, Timestamp, where } from "@firebase/firestore";
import { db } from "@/firebase/firebaseClient";

const InvoiceDetails = () => {
  const dispatch = useAppDispatch();
  const { items, isInvoiceLoading, showPaymentDialog, invoiceId } =
    useAppSelector((state) => state.invoice);
  const { user } = useAppSelector((state) => state.auth);
  const [invoices, setInvoices] = useState(0);

  // Totals
  const total =
    items?.reduce((acc, item) => acc + item.quantity * item.price, 0) || 0;
  const discount = items?.reduce((acc, item) => acc + item.discount, 0) || 0;
  const subtotal = total - discount;

  useEffect(() => {
    if (user) {
      dispatch(getPosCartItems());
      fetchTodayOrders();
    }
  }, [dispatch, user]);

  const fetchTodayOrders = async () => {
    try {
      const startOfDay = Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0)));
      const endOfDay = Timestamp.fromDate(new Date(new Date().setHours(23, 59, 59)));
      const ordersQuery = query(
        collection(db, "orders"),
        where("createdAt", ">=", startOfDay),
        where("createdAt", "<=", endOfDay),
        where("paymentStatus", "==", "Paid"),
        where("from", "==", "Store")
      );
      onSnapshot(ordersQuery, (snapshot) => setInvoices(snapshot.docs.length));
    } catch (error) {
      console.error("Error fetching today's orders:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-4 gap-4 bg-background">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center w-full mb-4 gap-4">
        <Profile />
        <div className="w-full flex flex-col">
          <h1 className="text-2xl font-bold">Invoice Details</h1>
          <p className="text-sm text-gray-500">
            Invoice #:{" "}
            <span className="uppercase font-medium">{invoiceId}</span>
          </p>
          <p className="text-sm text-gray-500">
            Today&apos;s Invoices: {invoices}
          </p>
        </div>
      </div>

      {/* Main content: Summary + Cart Items */}
      <div className="flex flex-col gap-4 flex-1">
        {/* Summary on top */}
        <div className="w-full bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 flex flex-col justify-between">
          <h2 className="text-lg font-semibold mb-3">Summary</h2>
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className="text-blue-700 font-medium">
                LKR {total.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Discount</span>
              <span className="text-blue-700 font-medium">
                LKR {discount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 font-bold text-lg">
              <span>Total</span>
              <span>LKR {subtotal.toFixed(2)}</span>
            </div>
          </div>
          <Button
            size="lg"
            onClick={() => dispatch(setShowPaymentDialog(true))}
            disabled={items.length === 0}
            className="w-full disabled:cursor-not-allowed disabled:bg-opacity-60"
          >
            Place Order
          </Button>
        </div>

        {/* Cart Items Scrollable */}
        <div className="flex-1 bg-white max-h-[60vh] dark:bg-gray-900 rounded-lg shadow-md p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-3">Cart Items</h2>
          <ScrollArea className="flex-1 overflow-y-auto">
            {items.length === 0 && !isInvoiceLoading && (
              <p className="text-center text-gray-500 mt-4">
                No items in the cart
              </p>
            )}
            {items.map((item, index) => (
              <CartItemCard key={index} item={item} />
            ))}
            {isInvoiceLoading && <LoadingScreen type="component" />}
          </ScrollArea>
        </div>
      </div>

      {showPaymentDialog && <PaymentForm />}
    </div>
  );
};

export default InvoiceDetails;
