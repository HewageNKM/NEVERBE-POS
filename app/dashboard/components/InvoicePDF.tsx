"use client";

import React, { useState } from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Order } from "@/interfaces";

interface InvoicePDFProps {
  order: Order;
}

const styles = StyleSheet.create({
  page: {
    fontFamily: "Courier-Bold",
    fontSize: 7,
    paddingHorizontal: 4,
    paddingVertical: 4,
    color: "#000",
  },
  header: { textAlign: "center", marginBottom: 4 },
  hr: { borderBottomWidth: 0.5, borderColor: "#000", marginVertical: 2 },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderColor: "#000",
    paddingBottom: 1,
    marginBottom: 1,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  left: { flex: 3 },
  right: { flex: 1, textAlign: "right" },
  textCenter: { textAlign: "center" },
  barcode: { marginTop: 4, width: "100%", height: 50, objectFit: "contain" },
});

const InvoicePDF: React.FC<InvoicePDFProps> = ({ order }) => {
  if (!order?.items?.length) {
    return (
      <Document>
        <Page style={styles.page}>
          <Text>No Order Data</Text>
        </Page>
      </Document>
    );
  }

  const total = order.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const totalDiscount = order.items.reduce((acc, i) => acc + i.discount, 0);
  const grandTotal = total - totalDiscount;
  const totalPaid =
    order.paymentReceived?.reduce((acc, p) => acc + p.amount, 0) || 0;
  const change = totalPaid - grandTotal;

  return (
    <Document>
      <Page size={{ width: "48mm", height: "274mm" }} style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={{ fontSize: 9, fontWeight: "bold" }}>NEVERBE</Text>
          <Text style={{ fontSize: 7 }}>330/4/10 New Kandy Road</Text>
          <Text style={{ fontSize: 7 }}>Delgoda</Text>
          <Text style={{ fontSize: 7 }}>+94 70 520 8999</Text>
          <Text style={{ fontSize: 7 }}>+94 72 924 9999</Text>
          <Text style={{ fontSize: 7 }}>info@neverbe.lk</Text>
        </View>

        <View style={styles.hr} />

        {/* Order Info */}
        <Text style={[styles.textCenter, { marginBottom: 4, fontSize: 8 }]}>
          Order ID: {order.orderId.toUpperCase()}
        </Text>

        {/* Items Table */}
        <View>
          <View style={styles.tableHeader}>
            <Text style={styles.left}>Item</Text>
            <Text style={styles.right}>Qty</Text>
            <Text style={styles.right}>Price</Text>
          </View>
          {order.items.map((item) => (
            <View key={item.itemId} style={styles.tableRow}>
              <View style={styles.left}>
                <Text style={{ fontSize: 7 }}>{item.name}</Text>
                {item.variantName && (
                  <Text style={{ fontSize: 6 }}>
                    {item.variantName} ({item.size})
                  </Text>
                )}
              </View>
              <Text style={styles.right}>{item.quantity}</Text>
              <Text style={styles.right}>
                {(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.hr} />

        {/* Totals */}
        <View style={{ textAlign: "right", marginBottom: 4 }}>
          <Text style={{ fontSize: 7 }}>Subtotal: {total.toFixed(2)}</Text>
          <Text style={{ fontSize: 7 }}>
            Discount: -{totalDiscount.toFixed(2)}
          </Text>
          <Text style={{ fontSize: 8, fontWeight: "bold" }}>
            Total: {grandTotal.toFixed(2)}
          </Text>
        </View>

        <View style={styles.hr} />

        {/* Payments */}
        {order.paymentReceived?.length > 0 && (
          <View style={{ marginBottom: 4 }}>
            <Text style={{ fontSize: 7 }}>Payments:</Text>
            {order.paymentReceived.map((p, idx) => (
              <View key={p.id} style={styles.tableRow}>
                <Text style={styles.left}>
                  {idx + 1}. {p.paymentMethod.toUpperCase()}
                  {p.cardNumber && p.cardNumber !== "None"
                    ? ` (${p.cardNumber})`
                    : ""}
                </Text>
                <Text style={styles.right}>{p.amount.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}

        {totalPaid > 0 && (
          <View style={{ textAlign: "right" }}>
            <Text style={{ fontSize: 7 }}>
              Total Paid: {totalPaid.toFixed(2)}
            </Text>
            {change > 0.01 && (
              <Text style={{ fontSize: 7 }}>Change: {change.toFixed(2)}</Text>
            )}
          </View>
        )}

        <View style={styles.hr} />
        {/* Footer */}
        <View style={styles.textCenter}>
          <Text style={{ fontSize: 6 }}>
            {new Date(order.createdAt || "").toLocaleString()}
          </Text>
          <Text style={{ fontSize: 7 }}>Thank You for Shopping!</Text>
          <Text style={{ fontSize: 6 }}>
            No further service without receipt!
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
