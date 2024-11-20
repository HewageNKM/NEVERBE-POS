"use client";
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setShowPaymentDialog } from "@/lib/invoiceSlice/invoiceSlice";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Payment {
    id: string;
    amount: number;
    paymentMethod: string;
}

const PaymentForm = () => {
    const dispatch = useAppDispatch();
    const { showPaymentDialog, items } = useAppSelector((state) => state.invoice);
    const [payments, setPayments] = useState([] as Payment[]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cash");
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

        const newPayment: Payment = {
            id: `${Date.now()}`.substring(9,11), // Unique ID based on timestamp
            amount,
            paymentMethod: selectedPaymentMethod,
        };
        setPayments([...payments, newPayment]);
        setPaymentAmount(""); // Reset input
    };

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
                                <SelectValue placeholder="Select Payment Method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="card">Card</SelectItem>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
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
                        onClick={() => {
                            alert("Payments confirmed!");
                            dispatch(setShowPaymentDialog(false));
                        }}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentForm;
