"use client"
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {hideAlert} from "@/lib/alertSlice/alertSlice";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader
} from "@/components/ui/alert-dialog";

const Alert = () => {
    const dispatch = useAppDispatch();
    const {title, buttonTitle, showAlert} = useAppSelector(state => state.alert);

    return (
        <AlertDialog open={showAlert}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogDescription>
                        {title}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => dispatch(hideAlert())}>{buttonTitle}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default Alert;