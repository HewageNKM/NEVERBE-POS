import React from 'react';
import {Order} from "@/interfaces";
import Barcode from "@/components/Barcode";

const Invoice = ({order}: { order: Order }) => {
    const getTotal = () => {
        return order?.items.map((item) => item.price * item.quantity).reduce((acc, curr) => acc + curr, 0);
    };
    return (
        <main className="invoice text-xs w-[58mm] p-4 bg-white text-black font-mono">
            {/* Header */}
            <header className="text-center">
                <h1 className="text-xs font-bold">NEVERBE</h1>
                <p className="text-[10px]">New Kandy Road, Delgoda</p>
                <p className="text-[10px]">+9472624999 +9470528999</p>
                <p className="text-[10px]">support@neverbe.lk</p>
            </header>
            <hr className="my-2 border-t border-gray-400"/>

            {/* Invoice Info */}
            <div>
                <p className="text-[10px]">Date: {order?.createdAt}</p>
                <p className="text-[10px]">Order #: <span className="uppercase">{order?.orderId}</span></p>
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
                {order?.items.map((item, index) => (
                    <React.Fragment key={index}>
                        <tr className="text-[12px]">
                            <td className="text-left uppercase">{item?.name}</td>
                            <td className="text-right">{item?.quantity}</td>
                            <td className="text-right">{item?.price}</td>
                        </tr>
                        <tr className="text-[8px]">
                            <td colSpan={3} className="pl-3 uppercase">
                                {item?.itemId}/{item?.variantId}/{item?.variantName}/{item.size}
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
                <Barcode value={order?.orderId}/>
            </footer>

        </main>
    );
};

export default Invoice;