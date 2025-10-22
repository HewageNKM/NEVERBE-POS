"use client";
import React from "react";
import { CartItem } from "@/interfaces";
import Image from "next/image";
import { releaseItem } from "@/app/actions/invoiceAction";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getPosCartItems, setIsInvoiceLoading } from "@/lib/invoiceSlice/invoiceSlice";
import { getProducts } from "@/lib/prodcutSlice/productSlice";
import { motion } from "framer-motion";

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
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="
        flex flex-col md:flex-row justify-between items-center gap-4 w-full
        p-4 rounded-xl shadow-sm hover:shadow-md
        bg-white dark:bg-neutral-950
        border border-gray-200 dark:border-neutral-800
        transition-all duration-300
      "
    >
      {/* Item Info */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="relative">
          <Image
            width={64}
            height={64}
            src={thumbnail || "/placeholder.png"}
            alt={name}
            className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-neutral-800"
          />
          <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="flex flex-col truncate min-w-0">
          <p className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
            {name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {variantName} / {size}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
            {itemId} / {variantId}
          </p>
        </div>
      </div>

      {/* Quantity & Pricing */}
      <div className="flex flex-col items-end gap-1 min-w-[130px] text-right">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Qty: {quantity}
        </span>

        <div className="flex flex-col items-end">
          {discount > 0 && (
            <span className="text-sm line-through text-gray-400">
              LKR {price.toFixed(2)}
            </span>
          )}
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            LKR {discountedPrice}
          </span>
        </div>

        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          Total: LKR {totalPrice}
        </span>

        <motion.div whileTap={{ scale: 0.97 }}>
          <Button
            variant="outline"
            onClick={removeItemFromCart}
            className="
              mt-2 text-sm font-medium
              border border-gray-300 dark:border-neutral-700
              text-gray-800 dark:text-gray-100
              bg-white hover:bg-gray-100
              dark:bg-neutral-900 dark:hover:bg-neutral-800
              transition-all duration-300
            "
          >
            Remove
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CartItemCard;
