// Hero.tsx
"use client";
import React, {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import DarkModeSelector from "@/components/DarkModeSelector";
import InvoicesForm from "@/app/dashboard/components/InvoicesForm";
import {useAppDispatch} from "@/lib/hooks";
import {setIsLoading, setProducts} from "@/lib/prodcutSlice/productSlice";
import {BsCash} from "react-icons/bs";
import UserAuthenticateDialog from "@/app/dashboard/components/UserAuthenticateDialog";
import {algoliasearch} from "algoliasearch";
import {Item} from "@/interfaces";

const Hero = () => {
    const [showInvoicesForm, setShowInvoicesForm] = useState(false);
    const [userAuthDialog, setUserAuthDialog] = useState(false)
    const [query, setQuery] = useState("")
    const client = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY);

    const dispatch = useAppDispatch();
    const onSearch = async (evt) => {
        evt.preventDefault()
        dispatch(setIsLoading(true));
        try {
            const results = await client.search({requests: [{indexName: "inventory_index", query}]});
            const filterInactives = results.results[0].hits.filter((item:Item) => item.status === "Active");
            dispatch(setProducts(filterInactives));
            evt.target.reset();
        } catch (e) {
            console.error(e);
        } finally {
            dispatch(setIsLoading(false));
        }
    }
    return (
        <div className="flex relative flex-row flex-wrap gap-5 bg-white dark:bg-[#0C090A] p-4 rounded shadow">
            <header>
                <form onSubmit={(evt) => onSearch(evt)}
                      className="flex-row flex w-[60vw] lg:w-[40vw] justify-center items-center gap-2">
                    <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="search"
                           className="text-lg"/>
                    <Button type={"submit"} className="text-lg font-medium">Search</Button>
                </form>
            </header>
            <div className="flex font-bold flex-row gap-3">
                <Button onClick={() => setUserAuthDialog(true)}><BsCash/>Drawer</Button>
                <Button onClick={() => setShowInvoicesForm(true)}>Invoices</Button>
                <DarkModeSelector/>
            </div>
            <InvoicesForm showInvoicesForm={showInvoicesForm} setShowInvoicesForm={setShowInvoicesForm}/>
            <UserAuthenticateDialog showUserAuthDialog={userAuthDialog}
                                    setShowUserAuthDialog={() => setUserAuthDialog(false)}/>
        </div>
    );
};

export default Hero;
