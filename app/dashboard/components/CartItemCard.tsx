"use client";
import React from "react";
import { CartItem } from "@/interfaces";
import Image from "next/image";
import { releaseItem } from "@/app/actions/invoiceAction";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getPosCartItems, setIsInvoiceLoading } from "@/lib/invoiceSlice/invoiceSlice";
import { getProducts } from "@/lib/prodcutSlice/productSlice";

const CartItemCard = ({ item }: { item: CartItem }) => {
  const { thumbnail, name, variantName, itemId, variantId, quantity, price, size, discount } = item;
  const dispatch = useAppDispatch();
  const { currentPage, currentSize } = useAppSelector((state) => state.product);

  const removeItemFromCart = async () => {
    try {
      dispatch(setIsInvoiceLoading(true));
      await releaseItem(item);
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(getProducts({ page: currentPage, size: currentSize }));
      dispatch(getPosCartItems());
      dispatch(setIsInvoiceLoading(false));
    }
  };

  const discountedPrice = (price - discount / quantity).toFixed(2);
  const totalPrice = (quantity * (price - discount)).toFixed(2);

  return (
    <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md gap-4 w-full">
      {/* Item Info */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Image
          width={64}
          height={64}
          src={thumbnail}
          alt={name}
          className="w-16 h-16 object-cover rounded-md"
        />
        <div className="flex flex-col truncate min-w-0">
          <p className="text-lg font-medium truncate">{name}</p>
          <p className="text-sm text-gray-500 truncate">{variantName}/{size}</p>
          <p className="text-xs text-gray-400 truncate">{itemId} / {variantId}</p>
        </div>
      </div>

      {/* Quantity & Pricing */}
      <div className="flex flex-col items-end gap-1 min-w-[120px] text-right">
        <span className="text-sm font-medium">Qty: {quantity}</span>
        <div className="flex flex-col">
          {discount > 0 && (
            <span className="text-sm line-through text-gray-400">LKR {price.toFixed(2)}</span>
          )}
          <span className="text-lg font-bold text-yellow-500">LKR {discountedPrice}</span>
        </div>
        <span className="text-sm text-gray-500 font-medium">Total: LKR {totalPrice}</span>
        <Button
          variant="outline"
          onClick={removeItemFromCart}
          className="mt-2 text-sm text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900"
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default CartItemCard;
