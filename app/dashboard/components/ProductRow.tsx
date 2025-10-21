"use client";

import React from "react";
import { Item } from "@/interfaces";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ProductRowProps {
  product: Item;
  onSelect: (product: Item) => void;
}

const ProductRow: React.FC<ProductRowProps> = ({ product, onSelect }) => {
  const discountedPrice =
    Math.round(
      (product.sellingPrice - (product.discount * product.sellingPrice) / 100) /
        10
    ) * 10;

  const isDiscounted = product.discount > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      whileHover={{
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center 
                 border border-border rounded-lg p-3 shadow-sm 
                 hover:shadow-md bg-background
                 hover:bg-muted/50 dark:hover:bg-muted/70 
                 transition-all duration-200"
    >
      {/* Thumbnail */}
      <div className="flex justify-center md:justify-start">
        <div className="relative w-20 h-20 overflow-hidden rounded-md border bg-gray-100 dark:bg-gray-900">
          <Image
            width={80}
            height={80}
            src={product.thumbnail?.url || "/placeholder.png"}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Manufacturer */}
      <div className="text-sm capitalize md:text-base text-muted-foreground">
        {product.manufacturer || "-"}
      </div>

      {/* Name */}
      <div className="text-sm md:text-base font-semibold">
        {product.name}
      </div>

      {/* Price */}
      <div className="text-sm md:text-base font-semibold">
        {isDiscounted ? (
          <div className="flex flex-col">
            <span className="text-yellow-600 dark:text-yellow-400">
              {discountedPrice.toFixed(2)}
            </span>
            <span className="text-xs line-through text-gray-400">
              {product.sellingPrice.toFixed(2)}
            </span>
          </div>
        ) : (
          <span>{product.sellingPrice.toFixed(2)}</span>
        )}
      </div>

      {/* Discount */}
      <div className="text-sm md:text-base text-center md:text-left">
        {isDiscounted ? `${product.discount}%` : "—"}
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-center md:justify-start">
        <Button size="sm" variant="secondary" onClick={() => onSelect(product)}>
          Select
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductRow;
