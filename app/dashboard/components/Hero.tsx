import React from 'react';
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {IoMenu} from "react-icons/io5";

const Hero = () => {
    return (
        <div className="flex flex-row gap-10">
            <DropdownMenu>
                <DropdownMenuTrigger className="flex flex-row gap-1 justify-center items-center">
                    <IoMenu size={40}/>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <header>
                <Label className="flex-row flex w-[60vw] lg:w-[40vw] justify-center items-center gap-2">
                    <Input placeholder="search" className="text-lg"/>
                    <Button className="text-lg font-medium">Search</Button>
                </Label>
            </header>

        </div>
    );
};

export default Hero;