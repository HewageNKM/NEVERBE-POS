import React from 'react';
import {Metadata} from "next";

export const metadata:Metadata ={
    title: "Dashboard",
    description: "NEVERBE POS Dashboard",
}
const Page = () => {
    return (
        <main>
            <section>
                <h1>
                    Dashboard
                </h1>
            </section>
        </main>
    );
};

export default Page;