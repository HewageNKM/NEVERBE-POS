"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

interface CashEntry {
  id?: string;
  userId: string;
  storeId: string;
  amount: number;
  note?: string;
  date: string;
  image?: string;
  status: "SUBMITTED" | "APPROVED" | "REJECTED";
}

interface PrettyCashDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  storeId: string;
}

const PrettyCashDialog: React.FC<PrettyCashDialogProps> = ({
  open,
  onOpenChange,
  userId,
  storeId,
}) => {
  const { toast } = useToast();

  const [cashEntries, setCashEntries] = useState<CashEntry[]>([]);
  const [cashAmount, setCashAmount] = useState("");
  const [cashNote, setCashNote] = useState("");
  const [cashImage, setCashImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  /** ---------- Fetch entries ---------- **/
  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/pretty-cash?storeId=${storeId}`);
      if (!res.ok) throw new Error("Failed to fetch entries");
      const data = await res.json();
      setCashEntries(data);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /** ---------- Add entry ---------- **/
  const addCashEntry = async () => {
    const amountNum = parseFloat(cashAmount);
    if (!amountNum || amountNum <= 0)
      return toast({
        title: "Invalid Amount",
        description: "Enter a valid amount.",
        variant: "destructive",
      });

    const reader = new FileReader();
    reader.onload = async () => {
      const payload: Omit<CashEntry, "id"> = {
        userId,
        storeId,
        amount: amountNum,
        note: cashNote,
        date: new Date().toISOString(),
        image: reader.result as string | undefined,
        status: "SUBMITTED",
      };

      try {
        setLoading(true);
        const res = await fetch("/api/v1/pretty-cash", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to add cash entry");
        toast({
          title: "Added",
          description: "Cash entry added successfully.",
        });
        fetchEntries();
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setCashAmount("");
        setCashNote("");
        setCashImage(null);
        setLoading(false);
      }
    };

    if (cashImage) reader.readAsDataURL(cashImage);
    else reader.onload();
  };

  /** ---------- Delete entry ---------- **/
  const deleteEntry = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    try {
      const res = await fetch(`/api/v1/pretty-cash/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete entry");
      toast({ title: "Deleted", description: "Entry deleted successfully." });
      setCashEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  /** ---------- Edit status ---------- **/
  const updateStatus = async (id: string, status: CashEntry["status"]) => {
    try {
      const res = await fetch(`/api/v1/pretty-cash/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast({ title: "Updated", description: "Status updated successfully." });
      fetchEntries();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  /** ---------- Lifecycle ---------- **/
  useEffect(() => {
    if (open) fetchEntries();
  }, [open]);

  const totalCash = cashEntries.reduce((acc, e) => acc + e.amount, 0);

  /** ---------- Render ---------- **/
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Pretty Cash</DialogTitle>
        </DialogHeader>

        {/* Entry Form */}
        <div className="space-y-3 mt-3">
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Amount"
              value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value)}
              type="number"
              className="w-32"
            />
            <Input
              placeholder="Note (optional)"
              value={cashNote}
              onChange={(e) => setCashNote(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 1024 * 1024) {
                    toast({
                      title: "File too large",
                      description: "Please upload an image smaller than 1 MB.",
                      variant: "destructive",
                    });
                    e.target.value = ""; // reset file input
                    return;
                  }
                  setCashImage(file);
                } else {
                  setCashImage(null);
                }
              }}
            />
            
            <Button onClick={addCashEntry} disabled={loading}>
              Add
            </Button>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300">
            Total Cash:{" "}
            <span className="font-bold">{totalCash.toFixed(2)}</span>
          </p>

          {/* Entries Table */}
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Amount</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cashEntries.length > 0 ? (
                  cashEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.amount.toFixed(2)}</TableCell>
                      <TableCell>{entry.note || "-"}</TableCell>
                      <TableCell>
                        {new Date(entry.date).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {entry.status === "SUBMITTED" ? (
                          <select
                            className="border p-1 text-xs rounded-md"
                            value={entry.status}
                            onChange={(e) =>
                              updateStatus(
                                entry.id!,
                                e.target.value as CashEntry["status"]
                              )
                            }
                          >
                            <option value="SUBMITTED">SUBMITTED</option>
                            <option value="APPROVED">APPROVED</option>
                            <option value="REJECTED">REJECTED</option>
                          </select>
                        ) : (
                          <span className="text-xs font-medium">
                            {entry.status}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {entry.image && (
                          <Image
                            src={entry.image}
                            alt="receipt"
                            width={50}
                            height={50}
                            className="rounded-md"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {entry.status === "SUBMITTED" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteEntry(entry.id!)}
                          >
                            Delete
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No entries found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => {
              onOpenChange(false);
              setCashAmount("");
              setCashNote("");
              setCashImage(null);
            }}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrettyCashDialog;
