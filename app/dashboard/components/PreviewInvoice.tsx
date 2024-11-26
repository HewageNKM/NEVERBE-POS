import React, {useRef} from "react";
import {CartItem} from "@/interfaces";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useAppDispatch} from "@/lib/hooks";
import {clearPreviewOrder, setPreviewInvoice} from "@/lib/invoiceSlice/invoiceSlice";
import {jsPDF} from "jspdf";
import html2canvas from "html2canvas";
import Invoice from "@/app/dashboard/components/Invoice";

export default function InvoicePreview({
                                           items,
                                           invoiceId,
                                           previewInvoice,
                                           hidePreview,
                                           resetOrder,
                                       }: {
    items: CartItem[];
    previewInvoice: boolean;
    invoiceId: string;
    resetOrder?: () => void;
    hidePreview?: () => void;
}) {
    const dispatch = useAppDispatch();
    const invoiceRef = useRef<HTMLDivElement>(null);

    const clearOrder = () => {
        dispatch(setPreviewInvoice(false));
        dispatch(clearPreviewOrder());

        if (hidePreview) {
            hidePreview();
        }
        if (resetOrder) {
            resetOrder();
        }
    };

    const printInvoice = async () => {
        if (invoiceRef.current) {
            // Capture the invoice content as a canvas
            html2canvas(invoiceRef.current).then((canvas) => {

                // Create a new jsPDF instance
                const doc = new jsPDF({
                    orientation: "portrait",
                    unit: "mm",
                    format:[58, 100],
                });

                // Open the generated PDF in a new tab
                const pdfUrl = doc.output("bloburl");
                window.open(pdfUrl, "_blank");
            });
        }
    };


    return (
        <Dialog open={previewInvoice} onOpenChange={() => clearOrder()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Preview Invoice</DialogTitle>
                    <div className="w-full mt-5 flex justify-center items-center flex-col gap-3">
                        {/* Pass the ref to the Invoice component */}
                        <div ref={invoiceRef}>
                            <Invoice invoiceId={invoiceId} items={items}/>
                        </div>
                        <div className="w-full flex justify-center items-center">
                            <Button onClick={printInvoice}>Print</Button>
                        </div>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
