"use client"
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, MoveLeft } from "lucide-react";
import Link from "next/link";

const NotFound = () => {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
            <Card className="w-full max-w-md mx-auto">
                <CardContent className="pt-16 pb-12 text-center">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-7xl font-bold text-primary">404</h1>
                            <h2 className="text-2xl font-semibold tracking-tight">Page not found</h2>
                            <p className="text-sm text-muted-foreground">
                                The page you&#39;re looking for doesn&#39;t exist or has been moved.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                            <Button
                                variant="default"
                                asChild
                                className="w-full sm:w-auto"
                            >
                                <Link href="/">
                                    <Home className="mr-2 h-4 w-4" />
                                    Back to home
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => window.history.back()}
                                className="w-full sm:w-auto"
                            >
                                <MoveLeft className="mr-2 h-4 w-4" />
                                Go back
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default NotFound;