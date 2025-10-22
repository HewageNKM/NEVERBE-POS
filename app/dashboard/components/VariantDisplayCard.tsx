"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Variant } from "@/interfaces";
import Image from "next/image";
import { motion } from "framer-motion";

const VariantDisplayCard = ({
  variant,
  onClick,
}: {
  variant: Variant;
  onClick: (variant: Variant) => void;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 12 }}
      onClick={() => onClick(variant)}
      className="cursor-pointer"
    >
      <Card
        className="
          group overflow-hidden rounded-xl shadow-sm hover:shadow-md
          border border-gray-200 dark:border-neutral-800
          hover:border-black/60 dark:hover:border-white/50
          bg-white dark:bg-neutral-900
          transition-all duration-300
        "
      >
        <CardContent className="flex items-center gap-4 p-3 sm:p-4">
          {/* Variant Image */}
          <div className="relative">
            <Image
              width={72}
              height={72}
              src={variant.images?.[0]?.url || "/placeholder.png"}
              alt={variant.variantName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border border-gray-100 dark:border-neutral-800"
            />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Variant Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-base sm:text-lg font-semibold capitalize truncate text-gray-900 dark:text-gray-100">
              {variant.variantName}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {variant.sizes?.length || 0} sizes available
            </p>
          </div>

          {/* Action Indicator */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Select →
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VariantDisplayCard;
