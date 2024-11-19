"use client";
import React from "react";
import {CartItem} from "@/interfaces";
import Image from "next/image";
import {useAppDispatch} from "@/lib/hooks";
import {removeItem} from "@/lib/invoiceSlice/invoiceSlice";

const CartItemCard = ({
                          item,
                      }: {
    item: CartItem;
}) => {
    const {thumbnail, name, variantName, itemId, variantId, quantity, price} = item;
    const dispatch = useAppDispatch();
    return (
        <li className="flex justify-between items-center my-2 w-full">
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
                    <p className="text-sm text-gray-500 capitalize">{variantName}</p>
                    <p className="text-sm text-gray-400">
                        ID: {itemId}, Variant: {variantId}
                    </p>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-lg font-medium">Qty: {quantity}</span>
                <span className="text-lg font-medium">LKR {price.toFixed(2)}</span>
                <span className="text-sm text-gray-500">Total: LKR {(quantity * price).toFixed(2)}</span>
                <button
                    onClick={() => dispatch(removeItem(item))}
                    className="mt-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-50"
                >
                    Remove
                </button>
            </div>
        </li>
    );
};

export default CartItemCard;
