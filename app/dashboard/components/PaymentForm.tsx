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
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cash");
    const [paymentAmount, setPaymentAmount] = useState("");
    const [fee, setFee] = useState(0)
    const [cardNumber, setCardNumber] = useState(null);
    const [loading, setLoading] = useState(false)
    const [paymentMethods, setPaymentMethods] = useState([])
    const {toast} = useToast()

    const getTotal = () => {
        return payments.map((invoice) => invoice.amount).reduce((acc, curr) => acc + curr, 0);
    };

    const getItemsTotal = () => {
        return items.map((item) => item.quantity * item.price).reduce((acc, curr) => acc + curr, 0);
    };
    const getTotalDiscount = () => {
        return items.map((item) => item.discount).reduce((acc, curr) => acc + curr, 0);
    }
    const getFee = () => {
        return parseFloat(((items.reduce((acc, item) => acc + item.quantity * item.price, 0) - getTotalDiscount() - getTotal()) * fee / 100).toFixed(2))
    }

    const getSubtotal = () => {
        return getItemsTotal() - getTotalDiscount() + getFee()
    }

    const addPayment = () => {
        const amount = parseFloat(paymentAmount);
        if (isNaN(amount) || amount < 0) {
            toast({
                title: "Invalid Amount",
                description: "Please enter a valid amount.",
                variant: "destructive",
            })
            return;
        }

        // Validate payment amount based on the selected payment method
        const dueAmount = getSubtotal() - getTotal();
        if (["card", "bank transfer", "qr"].includes(selectedPaymentMethod.toLowerCase()) && amount > dueAmount) {
            toast({
                title: "Invalid Amount",
                description: "Amount exceeds due amount.",
                variant: "destructive",
            });
            return;
        }

        if (selectedPaymentMethod.toLowerCase() === "card" && cardNumber.trim().length != 4) {
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
        setSelectedPaymentMethod("cash");
        setPaymentAmount("");
        setCardNumber(null);
        setFee(0)
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
                fee: 0,
                items: orderItems,
                orderId: (invoiceId || "").toLowerCase(),
                paymentMethod: payments.length > 1 ? "MIXED" : payments[0].paymentMethod.toUpperCase(),
                paymentStatus: "Paid",
                discount: getTotalDiscount(),
                createdAt: new Date().toISOString(),
                from: "Store",
            }

            const find = payments.find((payment) => payment.paymentMethod.toLowerCase() === "koko");

            if(find) {
               const itemsTotal = getItemsTotal() - getTotalDiscount();
               const receivedAmount = payments.map((invoice) => invoice.amount).reduce((acc, curr) => acc + curr, 0);
                newOrder.fee = receivedAmount - itemsTotal;
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
                            onValueChange={(value) => {
                                setSelectedPaymentMethod(value)
                                setFee(paymentMethods.find((method: PaymentMethod) => method.name.toLowerCase() === value.toLowerCase())?.fee || 0)
                            }}
                        >
                            <SelectTrigger
                            >
                                <SelectValue placeholder="Select Payment Method"/>
                            </SelectTrigger>
                            <SelectContent
                            >
                                {paymentMethods.map((method: PaymentMethod) => (
                                    <SelectItem key={method.name} value={method.name.toLowerCase()}>
                                        {method.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedPaymentMethod.toLowerCase() === "card" && (
                            <div className="flex flex-col gap-1">
                                <label>Card Number</label>
                                <InputOTP maxLength={4} onChange={(newValue) => setCardNumber(newValue)}>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0}/>
                                        <InputOTPSlot index={1}/>
                                        <InputOTPSeparator/>
                                        <InputOTPSlot index={2}/>
                                        <InputOTPSlot index={3}/>
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                        )}
                        {selectedPaymentMethod.toLowerCase() === "koko" && (
                            <Input
                                type="text"
                                placeholder="Koko Order ID"
                                value={cardNumber || ""}
                                onChange={(e) => setCardNumber(e.target.value)}
                            />
                        )}
                        <Input
                            className="disabled:cursor-not-allowed disabled:bg-opacity-60"
                            type="number"
                            placeholder="Enter payment amount"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                        />
                        <Button className="self-end disabled:cursor-not-allowed disabled:bg-opacity-60"
                                onClick={addPayment}>
                            Add Payment
                        </Button>
                    </div>
                    <div className="mt-3">
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="text-right font-bold">Fee({fee}%)</TableCell>
                                    <TableCell className="text-right text-red-500">{getFee().toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="text-right font-bold">Discount</TableCell>
                                    <TableCell
                                        className="text-right text-yellow-500">-{getTotalDiscount().toFixed(2)}</TableCell>
                                </TableRow>
                                {selectedPaymentMethod.toLowerCase() != "koko" && (
                                    <TableRow>
                                        <TableCell
                                            className={`text-right font-bold ${getItemsTotal() - getTotalDiscount() - getTotal() > 0 ? "text-red-500" : "text-green-500"}`}>
                                            {getItemsTotal() - getTotalDiscount() - getTotal() > 0 ? "Due" : "Change"}
                                        </TableCell>
                                        <TableCell
                                            className={`text-right ${getItemsTotal() - getTotalDiscount() - getTotal() > 0 ? "text-red-500" : "text-green-500"}`}>
                                            {(getItemsTotal() - getTotalDiscount() - getTotal()).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                )}
                                <TableRow>
                                    <TableCell
                                        className={`text-right font-bold ${getSubtotal() - getTotal() > 0 ? "text-red-500" : "text-green-500"}`}>
                                        {getSubtotal() - getTotal() > 0 ? "Due" : "Change"}
                                    </TableCell>
                                    <TableCell
                                        className={`text-right ${getSubtotal() - getTotal() > 0 ? "text-red-500" : "text-green-500"}`}>
                                        {(getSubtotal() - getTotal()).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
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
                        disabled={getTotal() < getSubtotal()}
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

