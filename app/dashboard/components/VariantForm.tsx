"use client";
import React, { useState } from "react";
import { CartItem, Item, Variant } from "@/interfaces";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import VariantDisplayCard from "@/app/dashboard/components/VariantDisplayCard";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { reserveItem } from "@/app/actions/invoiceAction";
import {
  getPosCartItems,
  setIsInvoiceLoading,
} from "@/lib/invoiceSlice/invoiceSlice";
import {
  setIsVariantsFormOpen,
  setSelectedItem,
} from "@/lib/prodcutSlice/productSlice";
import { showAlert } from "@/lib/alertSlice/alertSlice";
import { motion, AnimatePresence } from "framer-motion";

const VariantForm = () => {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [discount, setDiscount] = useState(0);
  const [qty, setQty] = useState(1);

  const { selectedItem, isVariantsFormOpen } = useAppSelector(
    (state) => state.product
  );
  const dispatch = useAppDispatch();

  const addToCart = async () => {
    const availableStock =
      selectedVariant?.sizes.find((s) => s.size === selectedSize)?.stock || 0;

    if (qty > availableStock) {
      dispatch(
        showAlert({
          buttonTitle: "Continue",
          title:
            "⚠️ Not enough stock available — you can still proceed with the order.",
          showAlert: true,
        })
      );
    }

    const totalDiscount =
      (discount +
        (selectedItem?.sellingPrice -
          Math.round(
            (selectedItem?.sellingPrice -
              (selectedItem?.discount * selectedItem?.sellingPrice) / 100) /
              10
          ) *
            10)) *
      qty;

    const newCartItem: CartItem = {
      bPrice: selectedItem?.buyingPrice,
      discount: totalDiscount,
      itemId: selectedItem?.itemId || "",
      name: selectedItem?.name || "",
      price: selectedItem?.sellingPrice || 0,
      quantity: qty,
      size: selectedSize,
      thumbnail: selectedItem?.thumbnail.url || "",
      type: selectedItem?.type || "",
      variantId: selectedVariant?.variantId || "",
      variantName: selectedVariant?.variantName || "",
    };

    try {
      dispatch(setIsInvoiceLoading(true));
      await reserveItem(newCartItem);
      onCancel();
    } catch (e: any) {
      console.error(e);
      const title: string = e.response?.data?.message || "An error occurred";
      dispatch(showAlert({ buttonTitle: "Okay", title, showAlert: true }));
    } finally {
      dispatch(getPosCartItems());
      dispatch(setIsInvoiceLoading(false));
    }
  };

  const onCancel = () => {
    dispatch(setIsVariantsFormOpen(false));
    dispatch(setSelectedItem({} as Item));
    setSelectedVariant(null);
    setSelectedSize("");
    setQty(1);
  };

  return (
    <Dialog open={isVariantsFormOpen} onOpenChange={onCancel}>
      <DialogContent
        className="
          sm:max-w-md 
          bg-white dark:bg-black 
          text-black dark:text-gray-100
          border border-gray-200 dark:border-neutral-800
          rounded-xl shadow-xl
          transition-colors duration-300
          p-6 overflow-hidden
        "
      >
        <DialogHeader>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {selectedVariant ? "Select Size & Quantity" : "Choose a Variant"}
            </DialogTitle>
          </motion.div>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* STEP 1: VARIANT SELECTION */}
          {!selectedVariant && (
            <motion.div
              key="variants-step"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ScrollArea className="h-72 w-full rounded-md border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 p-3 transition-colors duration-300">
                <div className="space-y-3 p-2">
                  {selectedItem?.variants?.map((variant) => (
                    <VariantDisplayCard
                      key={variant.variantId}
                      variant={variant}
                      onClick={() => setSelectedVariant(variant)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          )}

          {/* STEP 2: SIZE + DETAILS */}
          {selectedVariant && (
            <motion.div
              key="size-step"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-5 mt-3"
            >
              <div className="flex flex-col gap-2">
                <Label className="font-medium text-gray-800 dark:text-gray-200">
                  Select Size
                </Label>
                <Select
                  onValueChange={(value) => setSelectedSize(value)}
                  value={selectedSize}
                >
                  <SelectTrigger className="w-full border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100">
                    <SelectValue placeholder="Choose a size" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-800">
                    {selectedVariant.sizes.map((size) => (
                      <SelectItem key={size.size} value={size.size}>
                        {size.size} — {size.stock} in stock
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Label className="font-medium text-gray-800 dark:text-gray-200">
                    Quantity
                  </Label>
                  <Input
                    className="mt-1 bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-gray-100"
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => setQty(parseInt(e.target.value))}
                  />
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }}>
                  <Label className="font-medium text-gray-800 dark:text-gray-200">
                    Discount
                  </Label>
                  <Input
                    className="mt-1 bg-white dark:bg-neutral-900 border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-gray-100"
                    type="number"
                    value={discount.toString()}
                    onChange={(e) =>
                      setDiscount(Number.parseInt(e.target.value) || 0)
                    }
                  />
                </motion.div>
              </div>

              {selectedSize && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-right text-gray-500 dark:text-gray-400"
                >
                  Available Stock:{" "}
                  {
                    selectedVariant.sizes.find((s) => s.size === selectedSize)
                      ?.stock
                  }
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* FOOTER */}
        <DialogFooter className="flex justify-between mt-6">
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="
                bg-gray-100 hover:bg-gray-200 
                dark:bg-neutral-800 dark:hover:bg-neutral-700 
                text-gray-900 dark:text-gray-100 
                border border-gray-300 dark:border-neutral-700
                transition-colors
              "
            >
              Cancel
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button
              className="
                px-6
                bg-black text-white hover:bg-gray-800
                dark:bg-white dark:text-black dark:hover:bg-gray-200
                border border-transparent dark:border-gray-200
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors
              "
              type="button"
              disabled={!selectedVariant || !selectedSize || qty < 1}
              onClick={addToCart}
            >
              Add to Cart
            </Button>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VariantForm;
