"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DarkModeSelector from "@/components/DarkModeSelector";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setIsLoading, setProducts } from "@/lib/prodcutSlice/productSlice";
import { algoliasearch } from "algoliasearch";
import { Item } from "@/interfaces";
import { RootState } from "@/lib/store";
import { Search, FileText, DollarSign, Settings } from "lucide-react";

import InvoiceDialog from "./InvoiceDialog";
import PrettyCashDialog from "./PrettyCashDialog";
import SettingsDialog from "./SettingsDialog";

const Hero = () => {
  const [query, setQuery] = useState("");
  const [showInvoicesForm, setShowInvoicesForm] = useState(false);
  const [showCashDialog, setShowCashDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  const storeId = typeof window !== "undefined" ? window.localStorage.getItem("neverbePOSStoreId") : null;
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state: RootState) => state.auth.user);

  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!
  );

  const onSearch = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    dispatch(setIsLoading(true));
    try {
      const results = await client.search({
        requests: [{ indexName: "products_index", query }],
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
          <Button type="submit" size="icon">
            <Search className="w-5 h-5" />
          </Button>
        </form>

        <div className="flex flex-row gap-2 mt-2 md:mt-0">
          <Button onClick={() => setShowInvoicesForm(true)} variant="secondary" size="icon">
            <FileText className="w-5 h-5" />
          </Button>
          <Button onClick={() => setShowCashDialog(true)} variant="secondary" size="icon">
            <DollarSign className="w-5 h-5" />
          </Button>
          <Button onClick={() => setShowSettingsDialog(true)} variant="secondary" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
          <DarkModeSelector />
        </div>
      </div>

      <InvoiceDialog open={showInvoicesForm} onOpenChange={setShowInvoicesForm} />
      <PrettyCashDialog
        open={showCashDialog}
        onOpenChange={setShowCashDialog}
        userId={authUser?.uid || ""}
        storeId={storeId || ""}
      />
      <SettingsDialog
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
        user={authUser}
      />
    </>
  );
};

export default Hero;
