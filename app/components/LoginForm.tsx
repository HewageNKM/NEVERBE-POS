"use client"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import React from "react";
import Image from "next/image";
import {Logo} from "@/assets/images";

const FormSchema = z.object({
    email: z.string().email("Invalid email address"),
    password:z.string().min(8, "Password must be at least 8 characters long"),
})

const LoginForm = () => {

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {

    }

    return (
        <section className="w-full flex justify-center items-center" >
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
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex-col flex gap-3">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="text-lg">Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Your registered email.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="text-lg">Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Your login password.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className='w-full mt-2'>Login</Button>
                    </form>
                </Form>
            </div>
        </section>
    );
};

export default LoginForm;
