import React from 'react';
import Barcode from "@/components/Barcode";
import {CartItem} from "@/interfaces";

const Invoice = ({items, invoiceId}: { items: CartItem[], invoiceId: string }) => {
    const getTotal = () => {
        return items.map((item) => item.price * item.quantity).reduce((acc, curr) => acc + curr, 0);
    };
    return (
        <main className="invoice w-[80mm] p-4 bg-white text-black font-mono">
            {/* Header */}
            <header className="text-center">
                <h1 className="text-lg font-bold">NEVERBE</h1>
                <p className="text-sm">New Kandy Road, Delgoda</p>
                <p className="text-sm">+9472624999 +9470528999</p>
                <p className="text-sm">support@neverbe.lk</p>
            </header>
            <hr className="my-2 border-t border-gray-400"/>

            {/* Invoice Info */}
            <div className="text-sm">
                <p>Date: {new Date().toLocaleString()}</p>
                <p>Order #: <span className="uppercase">{invoiceId}</span></p>
            </div>
            <hr className="my-2 border-t border-gray-400"/>

            {/* Item List */}
            <table className="w-full text-sm">
                <thead>
                <tr>
                    <th className="text-left">Item</th>
                    <th className="text-right">Qty</th>
                    <th className="text-right">Price</th>
                </tr>
                </thead>
                <tbody>
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        <tr>
                            <td className="text-left uppercase">{item.itemId}</td>
                            <td className="text-right">{item.quantity}</td>
                            <td className="text-right">{item.price}</td>
                        </tr>
                        <tr className="text-xs">
                            <td colSpan={3} className="pl-3 uppercase">
                                {item.variantId}/{item.name}/{item.variantName}/{item.size}
                            </td>
                        </tr>
                    </React.Fragment>
                ))}
                </tbody>
            </table>

            <hr className="my-2 border-t border-gray-400"/>

            {/* Total */}
            <div className="text-sm text-right">
                <p>Subtotal: {getTotal()}</p>
                <p className="font-bold">Total: {getTotal()}</p>
            </div>
            <hr className="my-2 border-t border-gray-400"/>

            {/* Footer */}
            <footer className="text-center text-xs mt-4 flex flex-col justify-center items-center">
                <p>Thank you for shopping!</p>
                <p>Visit us again.</p>
                <div className="mt-2">
                    <Barcode value={invoiceId}/>
                </div>
            </footer>
        </main>
    );
};

export default Invoice;