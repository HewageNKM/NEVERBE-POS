"use client"
import React from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import Invoice from "@/app/dashboard/components/Invoice";
import {setPreviewInvoice, setPreviewOrder} from "@/lib/invoiceSlice/invoiceSlice";
import {sendPrintInvoice} from "@/app/actions/invoiceAction";

export default function InvoicePreview() {
    const dispatch = useAppDispatch();

    const {previewInvoice, previewOrder} = useAppSelector((state) => state.invoice);

    const clearOrder = () => {
        dispatch(setPreviewInvoice(false));
        dispatch(setPreviewOrder(null));
    };

    const printInvoice = async () => {
        try {
            await sendPrintInvoice(previewOrder);
        } catch (e) {
            console.error(e);
        } finally {
            clearOrder();
        }
    };

    return (
        <Dialog open={previewInvoice} onOpenChange={() => clearOrder()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Preview Invoice</DialogTitle>
                    <div className="w-full mt-5 flex justify-center items-center flex-col gap-3">
                        <Invoice order={previewOrder}/>
                        <div className="w-full flex justify-center items-center">
                            <Button onClick={() => printInvoice()}>Print</Button>
                        </div>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
