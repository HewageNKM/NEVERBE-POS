import React from 'react';
import { Metadata } from "next";
import Hero from "@/app/dashboard/components/Hero";
import Products from "@/app/dashboard/components/Products";
import InvoiceDetails from "@/app/dashboard/components/InvoiceDetails";

export const metadata: Metadata = {
    title: "POS",
    description: "NEVERBE POS Dashboard",
}

const Page = () => {
    return (
        <main className="w-full min-h-screen">
            <div className="lg:grid lg:grid-cols-6 gap-5 h-full flex flex-col">
                <div className="lg:col-span-4 bg-background p-8 h-full flex flex-col">
                    <Hero />
                    <div className="flex-grow min-h-[20vh]">
                        <Products />
                    </div>
                </div>
                <div className="lg:col-span-2 bg-background p-8 lg:min-h-screen">
                    <InvoiceDetails />
                </div>
            </div>
        </main>
    );
};

export default Page;
