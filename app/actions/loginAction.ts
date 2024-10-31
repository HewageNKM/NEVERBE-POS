"use server"

import {FormState} from "react-hook-form";
import {LoginFormSchema} from "@/app/components/LoginForm";

export const authenticateUser = async (state:FormState<any>, formData:FormData)=>{
    const validatedField = LoginFormSchema.safeParse({
        email:formData.get('email'),
        password:formData.get('password')
    });

    if(!validatedField.success){
        return{
            errors:validatedField.error.flatten()
        }
    }
}