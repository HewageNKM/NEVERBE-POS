"use client"
import React from 'react';
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {Card, CardContent} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {LogOut} from 'lucide-react';
import {useRouter} from "next/navigation";
import {clearUser} from "@/lib/authSlice/authSlice";
import {auth} from "@/firebase/firebaseClient";
import LiveClock from "@/components/LiveClock";

const Profile = () => {
    const {user} = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const getInitials = (name) => {
        return name?.split(' ').map((word: string[]) => word[0]).join('').toUpperCase() || '??';
    };

    const logout = async () => {
        try {
            dispatch(clearUser());
            await auth.signOut();
            router.replace('/');
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <Card className="w-full h-fit">
            <CardContent
                className="pt-6 flex flex-row justify-between p-4 rounded-lg  shadow-md dark:shadow-none transition-colors">
                <div className="flex flex-row gap-4 justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={user?.imageUrl} alt={user?.username}/>
                            <AvatarFallback>{getInitials(user?.username)}</AvatarFallback>
                        </Avatar>
                        <p className="font-medium">{user?.username}</p>
                    </div>
                </div>
                <LiveClock/>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="flex items-center gap-2"
                >
                    <LogOut className="h-4 w-4"/>
                </Button>
            </CardContent>
        </Card>
    );
};

export default Profile;