import React from 'react';
import {Metadata} from "next";
import Hero from "@/app/dashboard/components/Hero";
import Products from "@/app/dashboard/components/Products";
import InvoiceDetails from "@/app/dashboard/components/InvoiceDetails";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "NEVERBE POS Dashboard",
}
const Page = () => {
    return (
        <main className="w-full min-h-screen">
            <div className="lg:grid lg:grid-cols-6 gap-5 h-full flex flex-col">
                <div className="lg:col-span-4 bg-gray-50 p-8 h-screen">
                    <Hero/>
                    <Products />
                </div>
                <InvoiceDetails />
            </div>
        </main>
    );
};

export default Page;