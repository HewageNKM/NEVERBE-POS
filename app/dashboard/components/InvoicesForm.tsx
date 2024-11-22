import React, {useState} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";

const InvoicesForm = ({showInvoicesForm, setShowInvoicesForm}: {
    setShowInvoicesForm:  React.Dispatch<React.SetStateAction<boolean>>,
    showInvoicesForm: boolean
}) => {
    const [invoiceId, setInvoiceId] = useState("")
    const [error, setError] = useState(null)

    const getInvoice = () => {

    }
    return (
        <Dialog open={showInvoicesForm} onOpenChange={() => setShowInvoicesForm(false)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Invoices
                    </DialogTitle>
                    <div className="w-full pt-3 flex justify-center items-center flex-col gap-3">
                        <Input type={"text"}
                               placeholder={"XD90EP"}
                               value={invoiceId}
                               onChange={(event) => setInvoiceId(event.target.value)}/>
                        {error && <Label className="text-red-500">{error}</Label>}
                        <Button onClick={getInvoice}>
                            Get Invoice
                        </Button>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default InvoicesForm;