"use client"
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import React, {useEffect, useState} from "react";
import {LoginFormSchema} from "@/lib/definitions";
import {useRouter} from "next/navigation";
import {authenticateUser} from "@/app/actions/authAction";
import LoadingScreen from "@/components/LoadingScreen";
import {useAppSelector} from "@/lib/hooks";

const LoginForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const {user} = useAppSelector(state => state.auth);

    const form = useForm<z.infer<typeof LoginFormSchema>>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleLogin = async (data: { email: string; password: string; }) => {
        setIsLoading(true);
        try {
            const user = await authenticateUser(data.email, data.password);
            if (user) {
                router.push('/dashboard');
            } else {
                console.error('Failed to authenticate user');
            }
        } catch (e) {
            console.error(e);
            form.setError("email", {
                type: "manual",
                message: "Failed to authenticate user"
            });
            form.setError("password", {
                type: "manual",
                message: "Failed to authenticate user"
            });
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        if (user) {
            router.replace('/dashboard');
        }
    }, [user]);

    return (
        <div className="w-full flex justify-center items-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleLogin)} className="flex-col flex gap-3 w-full">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="text-lg">Email</FormLabel>
                                <FormControl>
                                    <Input required placeholder="Email" {...field} />
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
                                    <Input required placeholder="Password" {...field} type="password"/>
                                </FormControl>
                                <FormDescription>
                                    Your login password.
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full mt-2">Login</Button>
                </form>
            </Form>
            {isLoading && (<LoadingScreen/>)}
        </div>
    );
};

export default LoginForm;
