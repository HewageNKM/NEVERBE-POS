import React, {useState} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import InvoicePreview from "@/app/dashboard/components/PreviewInvoice";
import {Order} from "@/interfaces";
import {getAOrder} from "@/app/actions/invoiceAction";
import {useToast} from "@/hooks/use-toast";
import LoadingScreen from "@/components/LoadingScreen";

const InvoicesForm = ({showInvoicesForm, setShowInvoicesForm}: {
    setShowInvoicesForm: React.Dispatch<React.SetStateAction<boolean>>,
    showInvoicesForm: boolean
}) => {
    const [loading, setLoading] = useState(false)
    const [invoiceId, setInvoiceId] = useState("")
    const [showInvoicePreview, setShowInvoicePreview] = useState(false)
    const [order, setOrder] = useState<Order | null>(null)
    const {toast} = useToast()

    const getInvoice = async () => {
        setLoading(true)
        try {
            const fetchedOrder = await getAOrder(invoiceId);
            setOrder(fetchedOrder)
            setShowInvoicePreview(true)
        } catch (e) {
            console.error(e)
            toast({
                title: "Error",
                description: e.message,
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
            {loading ? <LoadingScreen type={"page"}/> : (
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
                                <Button onClick={getInvoice}>
                                    Get Invoice
                                </Button>
                            </div>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>)}
            <InvoicePreview items={order?.items}
                            previewInvoice={showInvoicePreview}
                            invoiceId={order?.orderId}
                            resetOrder={() => setOrder(null)}
                            hidePreview={() => setShowInvoicePreview(false)}/>
        </>
    );
};

export default InvoicesForm;