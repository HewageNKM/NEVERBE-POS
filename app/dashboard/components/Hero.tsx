"use client"
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DarkModeSelector from "@/components/DarkModeSelector";
import { useAppDispatch } from "@/lib/hooks";
import { setIsLoading, setProducts } from "@/lib/prodcutSlice/productSlice";
import { algoliasearch } from "algoliasearch";
import { Item } from "@/interfaces";

import InvoiceDialog from "./InvoiceDialog";
import PrettyCashDialog from "./PrettyCashDialog";

const Hero = () => {
  const [query, setQuery] = useState("");
  const [showInvoicesForm, setShowInvoicesForm] = useState(false);
  const [showCashDialog, setShowCashDialog] = useState(false);

  const dispatch = useAppDispatch();
  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!
  );

  const onSearch = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    dispatch(setIsLoading(true));
    try {
      const results = await client.search({
        requests: [{ indexName: "inventory_index", query }],
      });
      const filterInactives = results.results[0].hits.filter(
        (item: Item) => item.status === "Active"
      );
      dispatch(setProducts(filterInactives));
      setQuery("");
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <>
      <div className="w-full bg-card dark:bg-zinc-900 rounded-xl shadow-lg p-5 border border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <form onSubmit={onSearch} className="flex w-full md:w-[50%] gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 text-lg"
          />
          <Button type="submit" className="text-lg font-medium">Search</Button>
        </form>

        <div className="flex flex-row gap-3 mt-2 md:mt-0">
          <Button onClick={() => setShowInvoicesForm(true)} variant="secondary">
            Print Invoice
          </Button>
          <Button onClick={() => setShowCashDialog(true)} variant="secondary">
            Pretty Cash
          </Button>
          <DarkModeSelector />
        </div>
      </div>

      <InvoiceDialog open={showInvoicesForm} onOpenChange={setShowInvoicesForm} />
      <PrettyCashDialog open={showCashDialog} onOpenChange={setShowCashDialog} />
    </>
  );
};

export default Hero;
