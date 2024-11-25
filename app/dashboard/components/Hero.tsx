// Hero.tsx
"use client";
import React, {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import DarkModeSelector from "@/components/DarkModeSelector";
import InvoicesForm from "@/app/dashboard/components/InvoicesForm";

const Hero = () => {
    const [showInvoicesForm, setShowInvoicesForm] = useState(false);

    return (
        <div className="flex relative flex-row flex-wrap gap-10 bg-white dark:bg-[#0C090A] p-4 rounded shadow">
            <header>
                <form className="flex-row flex w-[60vw] lg:w-[40vw] justify-center items-center gap-2">
                    <Input placeholder="search" className="text-lg"/>
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
