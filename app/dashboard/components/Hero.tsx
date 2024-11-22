// Hero.tsx
"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DarkModeSelector from "@/components/DarkModeSelector";
import InvoicesForm from "@/app/dashboard/components/InvoicesForm";

const Hero = () => {
    const [showInvoicesForm, setShowInvoicesForm] = useState(false);

    return (
        <div className="flex relative flex-row flex-wrap gap-10 bg-white dark:bg-[#0C090A] p-4 rounded shadow">
            <header>
                <Label className="flex-row flex w-[60vw] lg:w-[40vw] justify-center items-center gap-2">
                    <Input placeholder="search" className="text-lg" />
                    <Button className="text-lg font-medium">Search</Button>
                </Label>
            </header>
            <div className="flex flex-row gap-5">
                <Button onClick={() => setShowInvoicesForm(true)}>Invoices</Button>
                <DarkModeSelector />
            </div>
            {showInvoicesForm && (
                <InvoicesForm
                    showInvoicesForm={showInvoicesForm}
                    setShowInvoicesForm={setShowInvoicesForm}
                />
            )}
        </div>
    );
};

export default Hero;
