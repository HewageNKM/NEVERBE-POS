"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/interfaces";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/firebase/firebaseClient";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
}

const SettingsDialog = ({ open, onOpenChange, user }: SettingsDialogProps) => {
  const [stocks, setStocks] = useState<any[]>([]);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) fetchStocks();
    const stored = localStorage.getItem("neverbePOSStockId");
    if (stored) setSelectedStock(stored);
  }, [open]);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser?.getIdToken();
      const res = await axios.get("/api/v1/stocks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStocks(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!selectedStock) {
      return;
    }
    localStorage.setItem("neverbePOSStockId", selectedStock);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label>User</Label>
            <p className="text-sm text-muted-foreground">
              {user?.username || "Unknown User"} ({user?.email || "No email"})
            </p>
          </div>

          <div>
            <Label>Stock Location</Label>
            <Select
              value={selectedStock || undefined}
              onValueChange={setSelectedStock}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={loading ? "Loading..." : "Select a stock"}
                />
              </SelectTrigger>
              <SelectContent>
                {stocks.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
