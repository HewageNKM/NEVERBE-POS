import React, {useState} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {getAOrder, sendPrintInvoice} from "@/app/actions/invoiceAction";
import {useToast} from "@/hooks/use-toast";
import LoadingScreen from "@/components/LoadingScreen";

const InvoicesForm = ({showInvoicesForm, setShowInvoicesForm}: {
    setShowInvoicesForm: React.Dispatch<React.SetStateAction<boolean>>,
    showInvoicesForm: boolean
}) => {
    const [loading, setLoading] = useState(false)
    const [invoiceId, setInvoiceId] = useState("")
    const {toast} = useToast()


    const getInvoice = async (evt) => {
        evt.preventDefault()
        setLoading(true)
        try {
            const fetchedOrder = await getAOrder(invoiceId.toLowerCase());
            await sendPrintInvoice(fetchedOrder);
            setShowInvoicesForm(false)
            evt.target.reset()
        } catch (e) {
            console.error(e)
            toast({
                title: "Error",
                description: `Something went wrong ${e.message}`,
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
                                    Print Invoice
                                </Button>
                            </form>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>)}
        </>
    );
};

export default InvoicesForm;