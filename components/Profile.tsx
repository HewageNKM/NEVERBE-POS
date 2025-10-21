// Profile.tsx
"use client";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { clearUser } from "@/lib/authSlice/authSlice";
import { auth } from "@/firebase/firebaseClient";
import LiveClock from "@/components/LiveClock";

const Profile = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const getInitials = (name?: string) => {
    return (
      name
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase() || "??"
    );
  };

  const logout = async () => {
    try {
      dispatch(clearUser());
      await auth.signOut();
      router.replace("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto rounded-xl overflow-hidden">
      <CardContent className="flex flex-col items-center justify-between gap-4 p-4">
        {/* User Info */}
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.imageUrl} alt={user?.username} />
            <AvatarFallback>{getInitials(user?.username)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-lg font-semibold">{user?.username}</p>
            <p className="text-sm text-gray-400 dark:text-gray-300">
              {user?.email || ""}
            </p>
          </div>
        </div>

        <div className="flex flex-row gap-2">
          {/* Live Clock */}
          <LiveClock />

          {/* Logout Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="flex items-center gap-2 border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;
