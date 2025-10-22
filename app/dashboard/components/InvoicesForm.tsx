"use client";

import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAOrder } from "@/app/actions/invoiceAction";
import { useToast } from "@/hooks/use-toast";
import LoadingScreen from "@/components/LoadingScreen";
import { useReactToPrint } from "react-to-print";
import Invoice from "./Invoice";
import { Order } from "@/interfaces";

const InvoicesForm = ({
  showInvoicesForm,
  setShowInvoicesForm,
}: {
  setShowInvoicesForm: React.Dispatch<React.SetStateAction<boolean>>;
  showInvoicesForm: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const [invoiceId, setInvoiceId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const { toast } = useToast();
  const invoiceRef = useRef<HTMLDivElement>(null);

  // React-to-print hook
  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `Invoice_${invoiceId}`,
  });

  const getInvoice = async (evt: React.FormEvent) => {
    evt.preventDefault();
    setLoading(true);

    try {
      const fetchedOrder = await getAOrder(invoiceId.toLowerCase());
      setOrder(fetchedOrder);
      // wait a bit to render, then print
      setTimeout(() => {
        handlePrint?.();
      }, 300);
    } catch (e: any) {
      console.error(e);
      toast({
        title: "Error",
        description: `Something went wrong: ${e.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setShowInvoicesForm(false);
      setInvoiceId("");
    }
  };

  return (
    <>
      {loading && <LoadingScreen type="page" />}

      <Dialog
        open={showInvoicesForm}
        onOpenChange={() => setShowInvoicesForm(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Print Invoice</DialogTitle>
            <form
              onSubmit={getInvoice}
              className="w-full pt-3 flex justify-center items-center flex-col gap-3"
            >
              <Input
                required
                type="text"
                placeholder="251022XXXXXX"
                value={invoiceId}
                onChange={(event) => setInvoiceId(event.target.value)}
              />
              <Button type="submit">Print Invoice</Button>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Hidden invoice for printing */}
      {order && (
        <div style={{ display: "none" }}>
          <div ref={invoiceRef}>
            <Invoice order={order} />
          </div>
        </div>
      )}
    </>
  );
};

export default InvoicesForm;
