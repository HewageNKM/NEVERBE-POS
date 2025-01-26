"use client";
import React, {useEffect, useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {getPosCartItems, initializeInvoicedId, setShowPaymentDialog} from "@/lib/invoiceSlice/invoiceSlice";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Order, OrderItem, Payment, PaymentMethod} from "@/interfaces";
import {addOrder, getAOrder, sendPrintInvoice} from "@/app/actions/invoiceAction";
import {useToast} from "@/hooks/use-toast";
import LoadingScreen from "@/components/LoadingScreen";
import {getProducts} from "@/lib/prodcutSlice/productSlice";
import {InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot} from "@/components/ui/input-otp";
import {getPOSPaymentMethods} from "@/app/actions/paymentsAction";


const PaymentForm = () => {
    const dispatch = useAppDispatch();
    const {items, invoiceId, showPaymentDialog} = useAppSelector((state) => state.invoice);
    const {currentSize, currentPage} = useAppSelector((state) => state.product);
    const [payments, setPayments] = useState([] as Payment[]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Cash");
    const [paymentAmount, setPaymentAmount] = useState("");
    const [cardNumber, setCardNumber] = useState(null);
    const [loading, setLoading] = useState(false)
    const [paymentMethods, setPaymentMethods] = useState([])
    const {toast} = useToast()

    const getTotal = () => {
        return payments.map((invoice) => invoice.amount).reduce((acc, curr) => acc + curr, 0);
    };

    const getItemsTotal = () => {
        const total = items.map((item) => item.quantity * item.price).reduce((acc, curr) => acc + curr, 0);
        return total - getTotalDiscount();
    };
    const getTotalDiscount = () => {
        return items.map((item) => item.discount).reduce((acc, curr) => acc + curr, 0);
    }
    const addPayment = () => {
        const amount = parseFloat(paymentAmount);
        if (isNaN(amount) || amount <= 0) {
            toast({
                title: "Invalid Amount",
                description: "Please enter a valid amount.",
                variant: "destructive",
            })
            return;
        }

        const dueAmount = getItemsTotal() - getTotal();

        // Validate payment amount based on the selected payment method
        if (["Card", "Bank Transfer", "QR"].includes(selectedPaymentMethod) && amount > dueAmount) {
            toast({
                title: "Invalid Amount",
                description: "Amount exceeds due amount.",
                variant: "destructive",
            });
            return;
        }
        if (selectedPaymentMethod === "Card" && cardNumber.trim().length != 4) {
            console.log(cardNumber)
            toast({
                title: "Invalid Card Number",
                description: "Please enter a valid card number.",
                variant: "destructive",
            });
            return
        }

        const newPayment: Payment = {
            id: `${Date.now()}`.substring(9, 11), // Unique ID based on timestamp
            amount,
            paymentMethod: selectedPaymentMethod,
            cardNumber: cardNumber || "None",
        };
        setPayments([...payments, newPayment]);
        setSelectedPaymentMethod("Cash");
        setPaymentAmount("");
        setCardNumber(null);
    };


    const placeOrder = async () => {
        setLoading(true)
        try {
            const orderItems: OrderItem[] = items.map((item) => ({
                itemId: item.itemId,
                variantId: item.variantId,
                name: item.name,
                variantName: item.variantName,
                size: item.size,
                quantity: item.quantity,
                price: item.price,
                discount: item.discount,
            }));

            let newOrder: Order = {
                paymentReceived: payments,
                items: orderItems,
                orderId: (invoiceId || "").toLowerCase(),
                paymentMethod: items.length > 0 ? payments[0].paymentMethod : "Mixed",
                paymentStatus: "Paid",
                discount: getTotalDiscount(),
                createdAt: new Date().toISOString(),
                from: "Store",
            }

            await addOrder(newOrder);
            dispatch(setShowPaymentDialog(false));
            newOrder = await getAOrder(newOrder.orderId);
            await sendPrintInvoice(newOrder);

            dispatch(getProducts({size: currentSize, page: currentPage}))
        } catch (e) {
            console.error(e);
            toast({
                title: "Something went wrong",
                description: `Can't connect to the printer or ${e.message}. Receipt won't be printed.`,
                variant: "destructive"
            })
        } finally {
            window.localStorage.removeItem("posInvoiceId");
            dispatch(getPosCartItems());
            dispatch(initializeInvoicedId());
            setLoading(false)
        }
    }

    const fetchPaymentMethod = async () => {
        try {
            const methods: PaymentMethod = await getPOSPaymentMethods();
            setPaymentMethods(methods)
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        fetchPaymentMethod()
    }, [])

    return (
        <Dialog
            open={showPaymentDialog}
            onOpenChange={() => {
                dispatch(setShowPaymentDialog(false));
                setPayments([]);
            }}
        >
            {loading ? (<LoadingScreen type={"page"}/>) : (<DialogContent className="sm:max-w-md md:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Payments</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <Table className="my-2">
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Card Number</TableHead>
                                <TableHead>Amount (LKR)</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell>{invoice.id}</TableCell>
                                    <TableCell className="capitalize">{invoice.paymentMethod}</TableCell>
                                    <TableCell>{invoice.cardNumber}</TableCell>
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
                            <SelectTrigger className="disabled:cursor-not-allowed disabled:bg-opacity-60"
                                           disabled={getTotal() - getItemsTotal() >= 0}
                            >
                                <SelectValue placeholder="Select Payment Method"/>
                            </SelectTrigger>
                            <SelectContent
                            >
                                {paymentMethods.map((method: PaymentMethod) => (
                                    <SelectItem key={method.name} value={method.name}>
                                        {method.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedPaymentMethod.toLowerCase() === "card" && (
                            <InputOTP maxLength={4} onChange={(newValue) => setCardNumber(newValue)}>
                                <InputOTPGroup>
                                    <InputOTPSlot index={0}/>
                                    <InputOTPSlot index={1}/>
                                    <InputOTPSeparator/>
                                    <InputOTPSlot index={2}/>
                                    <InputOTPSlot index={3}/>
                                </InputOTPGroup>
                            </InputOTP>
                        )}
                        <Input
                            className="disabled:cursor-not-allowed disabled:bg-opacity-60"
                            disabled={getTotal() - getItemsTotal() >= 0}
                            type="number"
                            placeholder="Enter payment amount"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                        />
                        <Button className="self-end disabled:cursor-not-allowed disabled:bg-opacity-60"
                                onClick={addPayment} disabled={getTotal() - getItemsTotal() >= 0}>
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
                        <h4 className={`text-xl font-bold text-yellow-500 `}>
                            Discount: LKR {getTotalDiscount()}
                        </h4>
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
            </DialogContent>)}
        </Dialog>
    );
};

export default PaymentForm;

