import type {Metadata} from "next";
import "./globals.css";
import StoreProvider from "@/app/StoreProvider";

export const metadata: Metadata = {
    title: {
        template: `%s | NEVERBE POS`,
        default: "NEVERBE POS",
    },
    description: "NEVERBE POS",
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
            {children}
        </StoreProvider>
        </body>
        </html>
    );
}
