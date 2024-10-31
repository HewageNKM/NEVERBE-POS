"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { LoginFormSchema } from "@/lib/definitions";
import { useRouter } from "next/navigation";

const LoginForm = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof LoginFormSchema>>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleLogin = (data) => {
        router.replace("/dashboard");
    };

    return (
        <div className="w-full flex justify-center items-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleLogin)} className="flex-col flex gap-3 w-full">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg">Email</FormLabel>
                                <FormControl>
                                    <Input required placeholder="Email" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Your registered email.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg">Password</FormLabel>
                                <FormControl>
                                    <Input required placeholder="Password" {...field} type="password" />
                                </FormControl>
                                <FormDescription>
                                    Your login password.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full mt-2">Login</Button>
                </form>
            </Form>
        </div>
    );
};

export default LoginForm;
