"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { pdf } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import { Order } from "@/interfaces";
import { getAOrder } from "@/app/actions/invoiceAction";

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InvoiceDialog: React.FC<InvoiceDialogProps> = ({ open, onOpenChange }) => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(false);

  const fetchOrder = async () => {
    if (!orderId.trim()) return;
    setLoadingOrder(true);
    setOrder(null);
    try {
      const data = await getAOrder(orderId);
      setOrder(data);
    } catch (e) {
      console.error(e);
      alert("Failed to fetch order. Check ID and try again.");
    } finally {
      setLoadingOrder(false);
    }
  };

  const printInvoice = async () => {
    if (!order) return alert("No order loaded to print!");
    try {
      const blob = await pdf(<InvoicePDF order={order} />).toBlob();
      const blobUrl = URL.createObjectURL(blob);
      const printWindow = window.open(blobUrl, "_blank");
      if (!printWindow) return alert("Failed to open print window.");
      printWindow.onload = () => printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      }, 500);
    } catch (err) {
      console.error("Printing failed", err);
      alert("Printing failed. See console for details.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Invoice Printing</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Input
            placeholder="Enter Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="text-base"
          />

          <Button
            onClick={fetchOrder}
            disabled={loadingOrder || !orderId.trim()}
            className="w-full"
          >
            {loadingOrder ? "Fetching Order..." : "Fetch Order"}
          </Button>

          {order && (
            <div className="bg-gray-50 dark:bg-zinc-800 p-3 rounded-md border border-border">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Order Found: <span className="font-bold">{order.orderId}</span>
              </p>
              <Button onClick={printInvoice} className="w-full">
                Print Invoice
              </Button>
            </div>
          )}

          {!order && !loadingOrder && orderId && (
            <p className="text-sm text-red-500 text-center">
              No order found. Please check the Order ID.
            </p>
          )}
        </div>

        <DialogFooter className="mt-4 flex justify-end">
          <Button
            variant="secondary"
            onClick={() => {
              onOpenChange(false);
              setOrderId("");
              setOrder(null);
            }}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDialog;
