import type {Metadata} from "next";
import "./globals.css";
import StoreProvider from "@/app/StoreProvider";
import GlobalProvider from "@/components/GlobalProvider";
import {ThemeProvider} from "@/app/ThemeProvider";
import {Toaster} from "@/components/ui/toaster";

export const metadata: Metadata = {
    title: {
        template: `%s`,
        default: "POS",
    },
    description: "POS",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={``}>
        <StoreProvider>
            <GlobalProvider>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange={false}
                >
                    {children}
                    <Toaster />
                </ThemeProvider>
            </GlobalProvider>
        </StoreProvider>
        </body>
        </html>
    );
}
