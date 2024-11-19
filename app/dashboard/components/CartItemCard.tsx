"use client";
import React from "react";
import {CartItem} from "@/interfaces";
import Image from "next/image";

const CartItemCard = ({item}: { item: CartItem }) => {
    const {thumbnail, name, variantName, itemId, variantId, quantity, price} = item;

    return (
        <li className="flex justify-between items-center my-2">
            <div className="flex items-center gap-4">
                <Image
                    width={48}
                    height={48}
                    src={thumbnail}
                    alt={name}
                    className="w-12 h-12 object-cover rounded"
                />
                <div>
                    <p className="text-lg font-medium">{name}</p>
                    <p className="text-sm text-gray-500">{variantName}</p>
                    <p className="text-sm text-gray-400">
                        ID: {itemId}, Variant: {variantId}
                    </p>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-lg font-medium">Qty: {quantity}</span>
                <span className="text-lg font-medium">LKR {price.toFixed(2)}</span>
                <span className="text-sm text-gray-500">
          Total: LKR {(quantity * price).toFixed(2)}
        </span>
            </div>
        </li>
    );
};

export default CartItemCard;