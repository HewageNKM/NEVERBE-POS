"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebaseClient";
import { isUserExists } from "@/app/actions/authAction";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setUser } from "@/lib/authSlice/authSlice";
import { initializeInvoicedId } from "@/lib/invoiceSlice/invoiceSlice";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import axios from "axios";

// 🔹 shadcn/ui components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stocks, setStocks] = useState<{ id: string; name: string }[]>([]);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [loadingStocks, setLoadingStocks] = useState(false);
  const { toast } = useToast()

  // 🔹 Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const usr = await isUserExists(user.uid);
          if (usr) {
            dispatch(setUser(usr));
            dispatch(initializeInvoicedId());
          }
        }
      } catch (e) {
        console.error(e);
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  // 🔹 Redirect unauthenticated users
  useEffect(() => {
    if (!authUser) router.replace("/");
  }, [authUser, router]);

  // 🔹 Restore user from localStorage
  useEffect(() => {
    const user = localStorage.getItem("neverPosUser");
    if (user) dispatch(setUser(JSON.parse(user)));
  }, [dispatch]);

  // 🔹 Check stock selection
  useEffect(() => {
    const storedStockId = localStorage.getItem("neverbePOSStockId");
    if (storedStockId) {
      setSelectedStock(storedStockId);
    }
    fetchStocks(storedStockId);
  }, [authUser]);

  // 🔹 Fetch stocks and validate stored stock
  const fetchStocks = async (storedStockId?: string | null) => {
    try {
      setLoadingStocks(true);
      const token = await auth.currentUser?.getIdToken();
      if (!token) return;

      const response = await axios.get("/api/v1/stocks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedStocks = response.data || [];
      setStocks(fetchedStocks);

      // Check if previously selected stock still exists
      if (storedStockId) {
        const exists = fetchedStocks.some((s: any) => s.id === storedStockId);
        if (!exists) {
          toast({
            title: "Stock unavailable",
            description: "Your previous stock no longer exists. Please select a new one.",
            variant: "destructive",
          });
          localStorage.removeItem("neverbePOSStockId");
          setIsStockModalOpen(true);
        }
      } else {
        setIsStockModalOpen(true);
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to fetch stocks",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingStocks(false);
    }
  };

  // 🔹 Handle confirmation
  const handleConfirmStock = () => {
    if (!selectedStock) {
      toast({
        title: "Select a stock",
        description: "Please choose a stock location to continue.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("neverbePOSStockId", selectedStock);
    setIsStockModalOpen(false);
    toast({ title: "Stock selected successfully." });
  };

  return (
    <>
      {children}

      <Dialog open={isStockModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Stock Location</DialogTitle>
          </DialogHeader>

          {loadingStocks ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-6">
              <Select
                onValueChange={setSelectedStock}
                value={selectedStock || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a stock..." />
                </SelectTrigger>
                <SelectContent>
                  {stocks.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex justify-end">
                <Button onClick={handleConfirmStock} disabled={!selectedStock}>
                  Continue
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GlobalProvider;