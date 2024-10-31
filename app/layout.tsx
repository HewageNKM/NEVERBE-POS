import type {Metadata} from "next";
import "./globals.css";

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
        {children}
        </body>
        </html>
    );
}
