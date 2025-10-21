"use client";

import React, { forwardRef } from "react";
import { Order } from "@/interfaces";
import Image from "next/image";
import { Logo } from "@/assets/images";
import Barcode from "@/components/Barcode";

interface InvoiceProps {
  order: Order;
}

const Invoice = forwardRef<HTMLDivElement, InvoiceProps>(({ order }, ref) => {
  const total = order.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const totalDiscount = order.items.reduce((acc, i) => acc + i.discount, 0);
  const grandTotal = total - totalDiscount;

  return (
    <div
      ref={ref}
      className="w-[54mm] text-xs font-mono mx-auto p-2 text-center text-black"
    >
      {/* ===== Header Section ===== */}
      <div className="flex flex-col items-center mb-2">
        <h2 className="text-base font-bold tracking-wide">NEVERBE</h2>
        <p className="text-[10px] leading-tight">
          330/4/10 New Kandy Road, Delgoda
        </p>
        <p className="text-[10px] leading-tight">📞 +94 70 520 8999</p>
        <p className="text-[10px] leading-tight">📞 +94 72 924 9999</p>
        <p className="text-[10px] leading-tight">✉️ info@neverbe.lk</p>
      </div>

      <hr className="border-dashed border-gray-400 my-1" />

      <p className="text-[10px] mb-2 text-center">
        <strong>Order ID:</strong> {order.orderId.toUpperCase()}
      </p>

      {/* ===== Items Table ===== */}
      <table className="w-full text-left text-[11px]">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="text-left">Item</th>
            <th className="text-right">Qty</th>
            <th className="text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.itemId}>
              <td>
                {item.name}
                {item.variantName && (
                  <span className="block text-[6px] capitalize text-gray-600">
                    {item.variantName}({item.size})
                  </span>
                )}
              </td>
              <td className="text-right">{item.quantity}</td>
              <td className="text-right">
                {(item.price * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr className="border-dashed border-gray-400 my-2" />

      {/* ===== Totals Section ===== */}
      <div className="text-right text-[11px] space-y-1">
        <p>Subtotal: {total.toFixed(2)}</p>
        <p>Discount: -{totalDiscount.toFixed(2)}</p>
        <p className="font-bold text-black">Total: {grandTotal.toFixed(2)}</p>
      </div>

      <hr className="border-dashed border-gray-400 my-2" />

      {/* ===== Payments Section ===== */}
      {order.paymentReceived && order.paymentReceived.length > 0 && (
        <div className="text-left text-[11px] mb-2">
          <p className="font-semibold mb-1">Payments:</p>
          {order.paymentReceived.map((p, idx) => (
            <div key={p.id} className="flex justify-between">
              <span>
                {idx + 1}. {p.paymentMethod.toUpperCase()}
                {p.cardNumber && p.cardNumber !== "None"
                  ? ` (${p.cardNumber})`
                  : ""}
              </span>
              <span>{p.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      <hr className="border-dashed border-gray-400 my-2" />

      {/* ===== Footer Section ===== */}
      <div className="text-center mt-2">
        <p className="text-[10px]">
          {new Date(order.createdAt || "").toLocaleString()}
        </p>
        <p className="text-[11px] font-semibold mt-1">
          Thank You for Shopping!
        </p>
        <p className="text-[10px]">No futher service without receipt!</p>
      </div>
    </div>
  );
});

Invoice.displayName = "Invoice";
export default Invoice;
