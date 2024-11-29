import React, {useState} from 'react';
import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {useAppSelector} from "@/lib/hooks";
import {Button} from "@/components/ui/button";
import {useToast} from "@/hooks/use-toast";
import {authenticatePassword} from "@/app/actions/authAction";
import {openDrawer} from "@/app/actions/invoiceAction";

const UserAuthenticateDialog = ({setShowUserAuthDialog, showUserAuthDialog}: {
    showUserAuthDialog: boolean,
    setShowUserAuthDialog: () => void
}) => {
    const {user} = useAppSelector((state) => state.auth);
    const [password, setPassword] = useState("")
    const {toast} = useToast();
    const [isLoading, setIsLoading] = useState(false)

    const onAuthFormSubmit = async (evt) => {
        evt.preventDefault()
        setIsLoading(true)
        try {
            await authenticatePassword(password);
            await openDrawer()
            closeDialog()
        } catch (e) {
            console.error(e);
            toast({
                title: "Error",
                description: e.message,
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
            setPassword("")
        }
    }
    const closeDialog = () => {
        setShowUserAuthDialog()
    }
    return (
        <Dialog open={showUserAuthDialog} onOpenChange={() => closeDialog()}>
            <DialogContent>
                <DialogTitle className="w-full pt-3 flex justify-center items-center flex-col gap-3">
                    Authenticate
                    <p className="text-sm">Please Authenticate to continue</p>
                </DialogTitle>
                <form onSubmit={(evt) => onAuthFormSubmit(evt)}
                      className="w-full pt-3 flex justify-center items-center flex-col gap-3">
                    <Input disabled className="disabled:bg-opacity-60 disabled:cursor-not-allowed"
                           value={user?.username || "???"}/>
                    <Input disabled={isLoading} className="disabled:bg-opacity-60 cursor-not-allowed" required
                           value={password} onChange={(event) => setPassword(event.target.value)}
                           type="password" placeholder="Password"/>
                    <Button disabled={isLoading} className="disabled:bg-opacity-60 cursor-not-allowed"
                            variant={"default"} type="submit">{isLoading ? "Authenticating" : "Authenticate"}</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UserAuthenticateDialog;