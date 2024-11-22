import React from "react";
import Invoice from "@/app/dashboard/components/Invoice";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useAppDispatch} from "@/lib/hooks";
import {BreakLine, CharacterSet, PrinterTypes, ThermalPrinter} from "node-thermal-printer";
import {clearPreviewOrder, setPreviewInvoice} from "@/lib/invoiceSlice/invoiceSlice";
import {CartItem} from "@/interfaces";

export default function InvoicePreview({items, invoiceId, previewInvoice, hidePreview, resetOrder}: {
    items: CartItem[],
    previewInvoice: boolean,
    invoiceId: string,
    resetOrder?: () => void,
    hidePreview?: () => void
}) {
    const dispatch = useAppDispatch();

    const getTotal = () => {
        return items.map((item) => item.price * item.quantity).reduce((acc, curr) => acc + curr, 0);
    }

    const printInvoice = async () => {
        try {
            const printer = new ThermalPrinter({
                type: PrinterTypes.EPSON,
                interface: 'printer:YourPrinterName', // Replace with actual printer name
                characterSet: CharacterSet.PC437_USA,
                removeSpecialCharacters: false,
                breakLine: BreakLine.WORD,
                width: 48,
                lineCharacter: "=",
            });

            printer.alignCenter();
            printer.println("NEVERBE");
            printer.println("New Kandy Road, Delgoda");
            printer.println("+9472624999 +9470528999");
            printer.println("support@neverbe.lk");
            printer.alignLeft();
            printer.drawLine();
            printer.println(`Date: ${new Date().toLocaleString()}`);
            printer.println(`Order #: ${invoiceId}`);
            printer.drawLine();
            printer.tableCustom([
                {text: "Item", align: "LEFT", width: 0.5},
                {text: "Qty", align: "RIGHT", width: 0.25},
                {text: "Price", align: "RIGHT", width: 0.25}
            ]);
            printer.drawLine();
            items.forEach((item) => {
                printer.tableCustom([
                    {text: item.itemId, align: "LEFT", width: 0.5},
                    {text: item.quantity.toString(), align: "RIGHT", width: 0.25},
                    {text: item.price.toString(), align: "RIGHT", width: 0.25}
                ]);
                printer.tableCustom([
                    {text: `${item.variantId}/${item.name}/${item.variantName}/${item.size}`, align: "LEFT", width: 1}
                ]);
            });
            printer.drawLine();
            printer.println(`Subtotal: ${getTotal()}`);
            printer.println(`Total: ${getTotal()}`);
            printer.drawLine();
            printer.alignCenter()
            printer.println("Thank you for shopping with us!");
            printer.println("Come again");
            printer.drawLine();
            printer.alignCenter()
            printer.printBarcode(invoiceId, 74, {height: 50});
            printer.cut();
            await printer.execute();
        } catch (e) {
            console.error(e);
        } finally {
            clearOrder()
        }
    };
    const clearOrder = () => {
        dispatch(setPreviewInvoice(false));
        dispatch(clearPreviewOrder());

        if (hidePreview) {
            hidePreview();
        }
        if (resetOrder) {
            resetOrder()
        }
    }
    return (
        <Dialog open={previewInvoice} onOpenChange={() => clearOrder()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Preview Invoice
                    </DialogTitle>
                    <div className="w-full mt-5 flex justify-center items-center flex-col gap-3">

                        <Invoice invoiceId={invoiceId} items={items}/>
                        <div className="w-full flex justify-center items-center">
                            <Button onClick={() => printInvoice()}>Print</Button>
                        </div>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
