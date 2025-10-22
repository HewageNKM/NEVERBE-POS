"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  getProducts,
  setCurrentPage,
  setIsVariantsFormOpen,
  setSelectedItem,
} from "@/lib/prodcutSlice/productSlice";
import LoadingScreen from "@/components/LoadingScreen";
import VariantForm from "@/app/dashboard/components/VariantForm";
import Alert from "@/components/Alert";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ProductRow from "./ProductRow";
import { motion } from "framer-motion";

const Products = () => {
  const { currentPage, isVariantsFormOpen, products, isLoading, currentSize } =
    useAppSelector((state) => state.product);
  const { showAlert } = useAppSelector((state) => state.alert);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // Fetch products on mount or page change
  useEffect(() => {
    if (user) dispatch(getProducts({ page: currentPage, size: currentSize }));
  }, [currentPage, user, dispatch]);

  const handlePageChange = (page: number) => {
    if (page >= 1) dispatch(setCurrentPage(page));
  };

  const handleSelect = (product: any) => {
    dispatch(setSelectedItem(product));
    dispatch(setIsVariantsFormOpen(true));
  };

  return (
    <div className="relative w-full bg-card dark:bg-zinc-900 rounded-xl shadow-lg p-5 border border-border mt-2 flex flex-col max-h-[80vh] transition-colors duration-300">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl lg:text-2xl font-bold tracking-wide">
          Products
        </h1>
      </div>

      {isLoading && <LoadingScreen type="component" />}
      {/* Product List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700 p-2 max-h-[60vh] scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700">
        {products.length === 0 && !isLoading ? (
          <p className="text-center text-lg text-gray-500 mt-5">
            No products to display
          </p>
        ) : (
          <motion.div
            layout
            className="flex flex-col gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {products.map((product) => (
              <motion.div
                key={product.itemId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProductRow product={product} onSelect={handleSelect} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationContent className="flex flex-wrap gap-1">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage - 1);
                }}
              />
            </PaginationItem>
            {[...Array(5)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={index + 1 === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(index + 1);
                  }}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Dialogs */}
      {isVariantsFormOpen && <VariantForm />}
      {showAlert && <Alert />}
    </div>
  );
};

export default Products;
