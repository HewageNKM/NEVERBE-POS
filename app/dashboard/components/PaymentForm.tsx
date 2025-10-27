"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  getPosCartItems,
  initializeInvoicedId,
  setShowPaymentDialog,
} from "@/lib/invoiceSlice/invoiceSlice";
import { getProducts } from "@/lib/prodcutSlice/productSlice";
import { addOrder } from "@/app/actions/invoiceAction";
import { getPOSPaymentMethods } from "@/app/actions/paymentsAction";
import { useToast } from "@/hooks/use-toast";
import LoadingScreen from "@/components/LoadingScreen";
import { Order, OrderItem, Payment, PaymentMethod } from "@/interfaces";
import { pdf } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";

const PaymentForm = () => {
  const dispatch = useAppDispatch();
  const { items, invoiceId, showPaymentDialog } = useAppSelector(
    (state) => state.invoice
  );
  const { currentSize, currentPage } = useAppSelector((state) => state.product);
  const { toast } = useToast();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cash");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [cardNumber, setCardNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  /** ---------- Derived Values ---------- **/
  const itemsTotal = useMemo(
    () => items.reduce((acc, i) => acc + i.quantity * i.price, 0),
    [items]
  );
  const totalDiscount = useMemo(
    () => items.reduce((acc, i) => acc + i.discount, 0),
    [items]
  );
  const paymentsTotal = useMemo(
    () => payments.reduce((acc, p) => acc + p.amount, 0),
    [payments]
  );
  const subtotal = useMemo(
    () => itemsTotal - totalDiscount,
    [itemsTotal, totalDiscount]
  );

  // NEW: Create a lowercase map for easy, case-insensitive fee lookup
  const paymentMethodsMap = useMemo(() => {
    const map = new Map<string, PaymentMethod>();
    paymentMethods.forEach((method) => {
      map.set(method.name.toLowerCase(), method);
    });
    return map;
  }, [paymentMethods]);

  /** ---------- Add Payment ---------- **/
  const addPayment = () => {
    const amount = parseFloat(paymentAmount);
    const dueAmount = subtotal - paymentsTotal;

    if (isNaN(amount) || amount <= 0)
      return toast({
        title: "Invalid Amount",
        description: "Please enter a valid payment amount.",
        variant: "destructive",
      });

    if (
      ["card", "bank transfer", "qr"].includes(
        selectedPaymentMethod.toLowerCase()
      ) &&
      amount > dueAmount
    )
      return toast({
        title: "Invalid Amount",
        description: "Amount exceeds the due amount.",
        variant: "destructive",
      });

    if (
      selectedPaymentMethod.toLowerCase() === "card" &&
      (!cardNumber || cardNumber.trim().length !== 4)
    )
      return toast({
        title: "Invalid Card Number",
        description: "Please enter the last 4 digits of the card.",
        variant: "destructive",
      });

    const method =
      paymentMethods.find(
        (m) => m.name.toLowerCase() === selectedPaymentMethod.toLowerCase()
      ) || ({} as PaymentMethod);

    const newPayment: Payment = {
      id: new Date().getTime().toString().slice(1, 5),
      paymentMethod: selectedPaymentMethod,
      paymentMethodId: method.paymentId || "",
      amount,
      cardNumber: cardNumber || "None",
    };

    setPayments((prev) => [...prev, newPayment]);
    setSelectedPaymentMethod("cash");
    setPaymentAmount("");
    setCardNumber(null);
  };

  /** ---------- Generate & Auto-Print PDF ---------- **/
  const generatePDF = async (order: Order) => {
    const blob = await pdf(<InvoicePDF order={order} />).toBlob();
    const url = URL.createObjectURL(blob);

    // Open the PDF in a new tab and trigger the print dialog
    const printWindow = window.open(url);
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    } else {
      console.error("Unable to open print window. Popups may be blocked.");
    }
  };

  /** ---------- Place Order ---------- **/
  const placeOrder = async () => {
    setLoading(true);
    try {
      // --- NEW CALCULATIONS ---
      const fee = 0; // POS orders have no 'other' fee
      const shippingFee = 0; // POS orders have no shipping

      // Calculate transaction fee
      const transactionFeeCharge = payments.reduce((acc, payment) => {
        const method = paymentMethodsMap.get(payment.paymentMethod.toLowerCase());
        const feePercent = method?.fee || 0;
        // Rounding fee for each payment to avoid precision errors
        const paymentFee = Math.round(payment.amount * (feePercent / 100) * 100) / 100;
        return acc + paymentFee;
      }, 0);

      // Calculate total (subtotal is already net of discounts)
      const total = subtotal + shippingFee + fee;
      // --- END NEW CALCULATIONS ---

      const orderItems: OrderItem[] = items.map((i) => ({
        itemId: i.itemId,
        bPrice: i.bPrice,
        variantId: i.variantId,
        name: i.name,
        variantName: i.variantName,
        size: i.size,
        quantity: i.quantity,
        price: i.price,
        discount: i.discount,
      }));

      const newOrder: Order = {
        orderId: (invoiceId || "").toLowerCase(),
        items: orderItems,
        fee: fee,
        shippingFee: shippingFee,
        discount: totalDiscount,
        paymentReceived: payments,
        createdAt: new Date().toISOString(),
        from: "Store",
        status: "Completed",
        paymentStatus: "Paid",
        paymentMethod:
          payments.length > 1
            ? "MIXED"
            : payments[0]?.paymentMethod?.toUpperCase(),
        ...(payments.length === 1 && {
          paymentMethodId: payments[0].paymentMethodId,
        }),
        // --- ADDED/UPDATED FIELDS ---
        total: Math.round(total * 100) / 100, // Add rounded total
        transactionFeeCharge: Math.round(transactionFeeCharge * 100) / 100, // Add rounded transaction fee
      };

      await addOrder(newOrder);
      await generatePDF(newOrder);

      // Reset state
      dispatch(getProducts({ page: currentPage, size: currentSize }));
      toast({ title: "Order Placed", description: "Invoice generated." });
    } catch (e: any) {
      toast({
        title: "Error",
        description: `Could not generate receipt. ${e.message}`,
        variant: "destructive",
      });
    } finally {
      window.localStorage.removeItem("posInvoiceId");
      dispatch(getPosCartItems());
      dispatch(initializeInvoicedId());
      dispatch(setShowPaymentDialog(false));
      setLoading(false);
    }
  };

  /** ---------- Fetch Payment Methods ---------- **/
  const fetchPaymentMethods = async () => {
    try {
      const methods = await getPOSPaymentMethods();
      setPaymentMethods(methods);
    } catch (e) {
      console.error("Payment method fetch failed:", e);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  /** ---------- Render ---------- **/
  return (
    <Dialog
      open={showPaymentDialog}
      onOpenChange={() => {
        dispatch(setShowPaymentDialog(false));
        setPayments([]);
      }}
    >
      {loading ? (
        <LoadingScreen type="page" />
      ) : (
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Complete Payment
            </DialogTitle>
          </DialogHeader>

          {/* Payments Table */}
          <div className="flex flex-col gap-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Method ID</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Card</TableHead>
                  <TableHead>Amount (LKR)</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.id}</TableCell>
                    <TableCell className="uppercase">
                      {p.paymentMethodId}
                    </TableCell>
                    <TableCell className="capitalize">
                      {p.paymentMethod}
                    </TableCell>
                    <TableCell>{p.cardNumber}</TableCell>
                    <TableCell>{p.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPayments((prev) =>
                            prev.filter((x) => x.id !== p.id)
                          )
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
                  <TableCell colSpan={5} className="font-semibold">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    LKR {paymentsTotal.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>

            {/* Add Payment Section */}
            <div className="flex flex-col gap-3 border-t pt-3">
              <Select
                value={selectedPaymentMethod}
                onValueChange={(val) => setSelectedPaymentMethod(val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((m) => (
                    <SelectItem key={m.paymentId} value={m.name.toLowerCase()}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedPaymentMethod === "card" && (
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Card Number</label>
                  <InputOTP maxLength={4} onChange={setCardNumber}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSeparator />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              )}

              {selectedPaymentMethod === "koko" && (
                <Input
                  placeholder="Koko Order ID"
                  value={cardNumber || ""}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              )}

              <Input
                type="number"
                placeholder="Enter amount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />

              <Button className="self-end" onClick={addPayment}>
                Add Payment
              </Button>
            </div>

            {/* Summary */}
            <div className="mt-3">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-right font-semibold">
                      Discount
                    </TableCell>
                    <TableCell className="text-right text-yellow-500">
                      -{totalDiscount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-right font-bold">
                      {subtotal - paymentsTotal > 0 ? "Due" : "Change"}
                    </TableCell>
                    <TableCell
                      className={`text-right ${
                        subtotal - paymentsTotal > 0
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {(subtotal - paymentsTotal).toFixed(2)}
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
              disabled={paymentsTotal < subtotal}
              onClick={placeOrder}
              className="font-semibold"
            >
              Confirm & Print Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default PaymentForm;