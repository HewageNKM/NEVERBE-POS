// Hero.tsx
"use client";
import React, {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import DarkModeSelector from "@/components/DarkModeSelector";
import InvoicesForm from "@/app/dashboard/components/InvoicesForm";
import {getAItem} from "@/app/actions/prodcutsAction";
import {useAppDispatch} from "@/lib/hooks";
import {setIsLoading, setProducts} from "@/lib/prodcutSlice/productSlice";
import {Item} from "@/interfaces";

const Hero = () => {
    const [showInvoicesForm, setShowInvoicesForm] = useState(false);
    const [itemId, setItemId] = useState("")
    const dispatch = useAppDispatch();
    const onSearch = async (evt) => {
        evt.preventDefault()
        dispatch(setIsLoading(true));
        try {
            const items = await getAItem(itemId.toLowerCase());
            dispatch(setProducts(items));
            console.log(items);
            evt.target.reset();
        } catch (e) {
            console.error(e);
        } finally {
            dispatch(setIsLoading(false));
        }
    }
    return (
        <div className="flex relative flex-row flex-wrap gap-10 bg-white dark:bg-[#0C090A] p-4 rounded shadow">
            <header>
                <form onSubmit={(evt) => onSearch(evt)}
                      className="flex-row flex w-[60vw] lg:w-[40vw] justify-center items-center gap-2">
                    <Input value={itemId} onChange={(e) => setItemId(e.target.value)} placeholder="search"
                           className="text-lg"/>
                    <Button type={"submit"} className="text-lg font-medium">Search</Button>
                </form>
            </header>
            <div className="flex flex-row gap-5">
                <Button onClick={() => setShowInvoicesForm(true)}>Invoices</Button>
                <DarkModeSelector/>
            </div>
            <InvoicesForm
                showInvoicesForm={showInvoicesForm}
                setShowInvoicesForm={setShowInvoicesForm}
            />
        </div>
    );
};

export default Hero;
