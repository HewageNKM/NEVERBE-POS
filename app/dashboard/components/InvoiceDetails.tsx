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
import {
  collection,
  onSnapshot,
  query,
  Timestamp,
  where,
} from "@firebase/firestore";
import { db } from "@/firebase/firebaseClient";

const InvoiceDetails = () => {
  const dispatch = useAppDispatch();
  const { items, isInvoiceLoading, showPaymentDialog, invoiceId } =
    useAppSelector((state) => state.invoice);
  const { user } = useAppSelector((state) => state.auth);
  const [invoices, setInvoices] = useState(0);

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
      const startOfDay = Timestamp.fromDate(
        new Date(new Date().setHours(0, 0, 0))
      );
      const endOfDay = Timestamp.fromDate(
        new Date(new Date().setHours(23, 59, 59))
      );
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
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4 w-full bg-card dark:bg-zinc-900 rounded-xl shadow-lg p-5 border border-border">
        <Profile />
        <div className="w-full flex flex-col">
          <h1 className="text-2xl font-bold">Invoice Details</h1>
          <p className="text-sm text-muted-foreground">
            Invoice #:{" "}
            <span className="uppercase font-medium tracking-wide">
              {invoiceId || "N/A"}
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            Today&apos;s Invoices:{" "}
            <span className="font-semibold">{invoices}</span>
          </p>
        </div>
      </div>

      {/* Main content: Summary + Cart Items */}
      <div className="flex flex-col gap-4 flex-1">
        {/* Summary */}
        <div className="w-full bg-card dark:bg-zinc-900 rounded-xl shadow-lg p-5 border border-border">
          <h2 className="text-lg font-semibold mb-3">Summary</h2>
          <div className="flex flex-col gap-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">LKR {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount</span>
              <span className="font-medium">LKR {discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-semibold">
              <span>Total</span>
              <span>LKR {subtotal.toFixed(2)}</span>
            </div>
          </div>
          <Button
            size="lg"
            variant="outline"
            onClick={() => dispatch(setShowPaymentDialog(true))}
            disabled={items.length === 0}
            className="w-full mt-2 border-2 border-foreground hover:bg-foreground hover:text-background transition-all disabled:opacity-50"
          >
            Place Order
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 bg-card dark:bg-zinc-900 rounded-xl shadow-lg p-5 border border-border flex flex-col">
          <h2 className="text-lg font-semibold mb-3">Cart Items</h2>
          <ScrollArea className="flex flex-col overflow-auto max-h-[50vh] scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700">
            {items.length === 0 && !isInvoiceLoading && (
              <p className="text-center text-muted-foreground mt-6">
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

      {/* Payment Dialog */}
      {showPaymentDialog && <PaymentForm />}
    </div>
  );
};

export default InvoiceDetails;
