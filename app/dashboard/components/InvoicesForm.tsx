import React, {useState} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import InvoicePreview from "@/app/dashboard/components/PreviewInvoice";
import {getAOrder} from "@/app/actions/invoiceAction";
import {useToast} from "@/hooks/use-toast";
import LoadingScreen from "@/components/LoadingScreen";
import {useAppDispatch} from "@/lib/hooks";
import {setPreviewInvoice, setPreviewOrder} from "@/lib/invoiceSlice/invoiceSlice";

const InvoicesForm = ({showInvoicesForm, setShowInvoicesForm}: {
    setShowInvoicesForm: React.Dispatch<React.SetStateAction<boolean>>,
    showInvoicesForm: boolean
}) => {
    const [loading, setLoading] = useState(false)
    const [invoiceId, setInvoiceId] = useState("")
    const dispatch = useAppDispatch();
    const {toast} = useToast()


    const getInvoice = async (evt) => {
        evt.preventDefault()
        setLoading(true)
        try {
            const fetchedOrder = await getAOrder(invoiceId.toLowerCase());
            dispatch(setPreviewOrder(fetchedOrder))
            dispatch(setPreviewInvoice(true))
            setShowInvoicesForm(false)
            evt.target.reset()
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
                            <form onSubmit={(evt) => getInvoice(evt)}
                                  className="w-full pt-3 flex justify-center items-center flex-col gap-3">
                                <Input required type={"text"}
                                       placeholder={"XD90EP"}
                                       value={invoiceId}
                                       onChange={(event) => setInvoiceId(event.target.value)}/>
                                <Button type={"submit"}>
                                    Get Invoice
                                </Button>
                            </form>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>)}
            <InvoicePreview/>
        </>
    );
};

export default InvoicesForm;