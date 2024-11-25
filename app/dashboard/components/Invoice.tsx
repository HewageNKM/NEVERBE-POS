import React from 'react';
import {CartItem} from "@/interfaces";
import Barcode from "@/components/Barcode";

const Invoice = ({items, invoiceId}: { items: CartItem[], invoiceId: string }) => {
    const getTotal = () => {
        return items?.map((item) => item.price * item.quantity).reduce((acc, curr) => acc + curr, 0);
    };

    return (
        <main className="invoice text-xs w-[58mm] p-4 bg-white text-black font-mono">
            {/* Header */}
            <header className="text-center">
                <h1 className="text-lg font-bold">NEVERBE</h1>
                <p className="text-xs">New Kandy Road, Delgoda</p>
                <p className="text-xs">+9472624999 +9470528999</p>
                <p className="text-xs">support@neverbe.lk</p>
            </header>
            <hr className="my-2 border-t border-gray-400"/>

            {/* Invoice Info */}
            <div>
                <p className="text-xs">Date: {new Date().toLocaleString()}</p>
                <p className="text-xs">Order #: <span className="uppercase">{invoiceId}</span></p>
            </div>
            <hr className="my-2 border-t border-gray-400"/>

            {/* Item List */}
            <table className="w-full">
                <thead>
                <tr className="text-sm">
                    <th className="text-left">Item</th>
                    <th className="text-right">Qty</th>
                    <th className="text-right">Price</th>
                </tr>
                </thead>
                <tbody>
                {items?.map((item, index) => (
                    <React.Fragment key={index}>
                        <tr className="text-xs">
                            <td className="text-left uppercase">{item.name}</td>
                            <td className="text-right">{item.quantity}</td>
                            <td className="text-right">{item.price}</td>
                        </tr>
                        <tr className="text-[8px]">
                            <td colSpan={3} className="pl-3 uppercase">
                                {item.itemId}/{item.variantId}/{item.variantName}/{item.size}
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
                <Barcode value={invoiceId}/>
            </footer>

        </main>
    );
};

export default Invoice;