import LoginForm from "@/app/components/LoginForm";
import Image from "next/image";
import {Logo} from "@/assets/images";
import React from "react";

export const metadata = {
    title: "Login",
    description: "Login to NEVERBE POS",
}
export default function Home() {
    return (
        <main className='min-h-screen w-full flex justify-center items-center'>
            <div className="md:px-8 px-4 py-4 md:py-4 lg:w-[30vw] md:w-[50vw] w-[95vw] border flex flex-col gap-5 rounded">
                <div className="flex flex-row justify-between flex-wrap-reverse items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Login</h1>
                        <p className="text-sm text-gray-500">Login to NEVERBE POS</p>
                    </div>
                    <figure>
                        <Image src={Logo} alt="neverbe logo" width={100} height={100}/>
                    </figure>
                </div>
                <LoginForm/>
            </div>
        </main>
);
}
