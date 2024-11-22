"use client";
import React, {useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {setPreviewInvoice, setShowPaymentDialog} from "@/lib/invoiceSlice/invoiceSlice";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {PaymentMethods} from "@/constant";
import {Order, OrderItem, Payment} from "@/interfaces";
import {addOrder} from "@/app/actions/invoiceAction";


const PaymentForm = () => {
    const dispatch = useAppDispatch();
    const {items,invoiceId,showPaymentDialog} = useAppSelector((state) => state.invoice);
    const [payments, setPayments] = useState([] as Payment[]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Cash");
    const [paymentAmount, setPaymentAmount] = useState("");

    const getTotal = () => {
        return payments.map((invoice) => invoice.amount).reduce((acc, curr) => acc + curr, 0);
    };

    const getItemsTotal = () => {
        return items.map((item) => item.price * item.quantity).reduce((acc, curr) => acc + curr, 0);
    };

    const addPayment = () => {
        const amount = parseFloat(paymentAmount);
        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid payment amount.");
            return;
        }

        const dueAmount = getItemsTotal() - getTotal();

        // Validate payment amount based on the selected payment method
        if (["Card", "Bank Transfer", "QR"].includes(selectedPaymentMethod) && amount > dueAmount) {
            alert(
                `${selectedPaymentMethod} payment cannot exceed the due amount of LKR ${dueAmount}.`
            );
            return;
        }

        const newPayment: Payment = {
            id: `${Date.now()}`.substring(9, 11), // Unique ID based on timestamp
            amount,
            paymentMethod: selectedPaymentMethod,
        };
        setPayments([...payments, newPayment]);
        setPaymentAmount(""); // Reset input
    };


    const placeOrder = async () => {
        try {
            const orderItems: OrderItem[] = items.map((item) => ({
                itemId: item.itemId,
                variantId: item.variantId,
                name: item.name,
                variantName: item.variantName,
                size: item.size,
                quantity: item.quantity,
                price: item.price,
            }));

            const newOrder: Order = {
                items: orderItems,
                orderId: invoiceId || "",
                paymentId: "None",
                paymentMethod: items.length > 0 ? payments[0].paymentMethod : "Mixed",
                paymentStatus: "Paid",
                shippingCost: 0,
                from:"Store",
            }
            await addOrder(newOrder);
            dispatch(setShowPaymentDialog(false));
            dispatch(setPreviewInvoice(true));
        } catch (e) {
            console.error(e);
        }
    }
    return (
        <Dialog
            open={showPaymentDialog}
            onOpenChange={() => {
                dispatch(setShowPaymentDialog(false));
                setPayments([]);
            }}
        >
            <DialogContent className="sm:max-w-md md:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Payments</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <Table className="my-2">
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Amount (LKR)</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell>{invoice.id}</TableCell>
                                    <TableCell className="capitalize">{invoice.paymentMethod}</TableCell>
                                    <TableCell>{invoice.amount}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setPayments(payments.filter((p) => p.id !== invoice.id))
                                            }
                                        >
                                            Remove
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3} className="font-semibold">
                                    Total
                                </TableCell>
                                <TableCell className="text-right">LKR {getTotal()}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                    <div className="flex flex-col gap-3">
                        <Select
                            value={selectedPaymentMethod}
                            onValueChange={(value) => setSelectedPaymentMethod(value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Payment Method"/>
                            </SelectTrigger>
                            <SelectContent>
                                {PaymentMethods.map((method) => (
                                    <SelectItem key={method.value} value={method.value}>
                                        {method.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            type="number"
                            placeholder="Enter payment amount"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                        />
                        <Button className="self-end" onClick={addPayment}>
                            Add Payment
                        </Button>
                    </div>
                    <div className="text-right mt-3">
                        <h3
                            className={`text-2xl font-bold ${
                                getItemsTotal() - getTotal() > 0 ? "text-red-500" : "text-green-500"
                            }`}
                        >
                            {getItemsTotal() - getTotal() > 0 ? "Due" : "Balance"}: LKR{" "}
                            {Math.abs(getItemsTotal() - getTotal())}
                        </h3>
                    </div>
                </div>
                <DialogFooter className="mt-4 flex justify-between">
                    <Button
                        variant="secondary"
                        onClick={() => {
                            dispatch(setShowPaymentDialog(false));
                            setPayments([]);
                        }}
                    >
                        Close
                    </Button>
                    <Button
                        disabled={getTotal() < getItemsTotal()}
                        onClick={() => placeOrder()}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentForm;
