"use client";

import React, { forwardRef } from "react";
import { Order } from "@/interfaces";
import Barcode from "@/components/Barcode";

interface InvoiceProps {
  order: Order;
}

const Invoice = forwardRef<HTMLDivElement, InvoiceProps>(({ order }, ref) => {
  const total = order.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const totalDiscount = order.items.reduce((acc, i) => acc + i.discount, 0);
  const grandTotal = total - totalDiscount;

  const totalPaid =
    order.paymentReceived?.reduce((acc, p) => acc + p.amount, 0) || 0;
  const change = totalPaid - grandTotal;

  return (
    <div
      ref={ref}
      className="w-[58mm] text-xs font-mono mx-auto p-1 text-center text-black"
    >
      {/* ===== Header ===== */}
      <div className="flex flex-col items-center mb-2">
        <h2 className="text-base font-bold tracking-wide">NEVERBE</h2>
        <p className="text-[10px] leading-tight">
          330/4/10 New Kandy Road, Delgoda
        </p>
        <p className="text-[10px] leading-tight">📞 +94 70 520 8999</p>
        <p className="text-[10px] leading-tight">📞 +94 72 924 9999</p>
        <p className="text-[10px] leading-tight">🖂 info@neverbe.lk</p>
      </div>

      <hr className="border-dashed border-black my-1" />

      <p className="text-[10px] mb-2 text-center">
        <strong>Order ID:</strong> {order.orderId.toUpperCase()}
      </p>

      {/* ===== Items Table ===== */}
      <table className="w-full text-left text-[10px]">
        <thead>
          <tr className="border-b border-black">
            <th className="text-left font-semibold">Item</th>
            <th className="text-right font-semibold">Qty</th>
            <th className="text-right font-semibold">Price</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.itemId}>
              <td className="align-top">
                {item.name}
                {item.variantName && (
                  <span className="block text-[9px] capitalize">
                    {item.variantName}({item.size})
                  </span>
                )}
              </td>
              <td className="text-right align-top">{item.quantity}</td>
              <td className="text-right align-top">
                {(item.price * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr className="border-dashed border-black my-2" />

      {/* ===== Totals ===== */}
      <div className="text-right text-[10px] space-y-0.5">
        <p>Subtotal: {total.toFixed(2)}</p>
        <p>Discount: -{totalDiscount.toFixed(2)}</p>
        <p className="font-bold text-black text-[11px]">
          Total: {grandTotal.toFixed(2)}
        </p>
      </div>

      <hr className="border-dashed border-black my-2" />

      {/* ===== Payments ===== */}
      {order.paymentReceived && order.paymentReceived.length > 0 && (
        <div className="text-left text-[10px] mb-2 space-y-0.5">
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

      {/* ===== Total Paid & Change ===== */}
      {totalPaid > 0 && (
        <div className="text-right text-[10px] space-y-0.5">
          <p>Total Paid: {totalPaid.toFixed(2)}</p>
          {change > 0.01 && (
            <p className="font-bold text-black text-[11px]">
              Change: {change.toFixed(2)}
            </p>
          )}
        </div>
      )}

      <hr className="border-dashed border-black my-2" />

      {/* ===== Footer ===== */}
      <div className="text-center mt-2 flex flex-col items-center">
        <p className="text-[10px]">
          {new Date(order.createdAt || "").toLocaleString()}
        </p>
        <p className="text-[11px] font-semibold mt-1">
          Thank You for Shopping!
        </p>
        <p className="text-[10px]">No further service without receipt!</p>

        {/* Barcode */}
        <div className="mt-2">
          <Barcode value={order.orderId.toUpperCase()} />
        </div>
      </div>
    </div>
  );
});

Invoice.displayName = "Invoice";
export default Invoice;
