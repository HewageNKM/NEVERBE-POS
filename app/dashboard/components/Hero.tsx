"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DarkModeSelector from "@/components/DarkModeSelector";
import InvoicesForm from "@/app/dashboard/components/InvoicesForm";
import { useAppDispatch } from "@/lib/hooks";
import { setIsLoading, setProducts } from "@/lib/prodcutSlice/productSlice";
import { algoliasearch } from "algoliasearch";
import { Item } from "@/interfaces";

const Hero = () => {
  const [showInvoicesForm, setShowInvoicesForm] = useState(false);
  const [query, setQuery] = useState("");
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
      const filterInactives = results.results[0].hits.filter((item: Item) => item.status === "Active");
      dispatch(setProducts(filterInactives));
      setQuery("");
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-white dark:bg-[#0C090A] rounded-lg shadow-md">
      {/* Search Form */}
      <form onSubmit={onSearch} className="flex w-full md:w-[60%] gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="flex-1 text-lg"
        />
        <Button type="submit" className="text-lg font-medium">
          Search
        </Button>
      </form>

      {/* Actions */}
      <div className="flex flex-row gap-3 mt-2 md:mt-0">
        <Button onClick={() => setShowInvoicesForm(true)} variant="secondary">
          Invoices
        </Button>
        <DarkModeSelector />
      </div>

      {/* Invoices Form Modal */}
      <InvoicesForm showInvoicesForm={showInvoicesForm} setShowInvoicesForm={setShowInvoicesForm} />
    </div>
  );
};

export default Hero;
