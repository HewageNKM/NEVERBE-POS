"use client";
import React from "react";
import {CartItem} from "@/interfaces";
import Image from "next/image";
import {releaseItem} from "@/app/actions/invoiceAction";
import {Button} from "@/components/ui/button";
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {getPosCartItems, setIsInvoiceLoading} from "@/lib/invoiceSlice/invoiceSlice";
import {getProducts} from "@/lib/prodcutSlice/productSlice";

const CartItemCard = ({
                          item,
                      }: {
    item: CartItem;
}) => {
    const {thumbnail, name, variantName, itemId, variantId, quantity, price, size} = item;
    const dispatch = useAppDispatch();
    const {currentPage,currentSize} = useAppSelector(state => state.product);

    const removeItemFromCart = async () => {
        try {
            dispatch(setIsInvoiceLoading(true));
            await releaseItem(item);
        } catch (e) {
            console.error(e);
        }finally {
            dispatch(getProducts({page: currentPage, size: currentSize}));
            dispatch(getPosCartItems());
            dispatch(setIsInvoiceLoading(false));
        }
    }
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
                    <p className="text-sm text-gray-500 capitalize">{variantName}/{size}</p>
                    <p className="text-sm text-gray-400 uppercase">
                        {itemId}/ {variantId}
                    </p>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-lg font-medium">Qty: {quantity}</span>
                <span className="text-lg font-medium">LKR {price.toFixed(2)}</span>
                <span className="text-sm text-gray-500">Total: LKR {(quantity * price).toFixed(2)}</span>
                <Button
                    variant={"outline"}
                    onClick={() => removeItemFromCart()}
                    className="mt-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded"
                >
                    Remove
                </Button>
            </div>
        </li>
    );
};

export default CartItemCard;
