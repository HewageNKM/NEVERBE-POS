"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import Image from "next/image";

interface CashEntry {
  id: number;
  amount: number;
  note?: string;
  date: string;
  image?: string;
}

interface PrettyCashDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PrettyCashDialog: React.FC<PrettyCashDialogProps> = ({ open, onOpenChange }) => {
  const [cashEntries, setCashEntries] = useState<CashEntry[]>([]);
  const [cashAmount, setCashAmount] = useState("");
  const [cashNote, setCashNote] = useState("");
  const [cashImage, setCashImage] = useState<File | null>(null);

  const addCashEntry = () => {
    const amountNum = parseFloat(cashAmount);
    if (!amountNum || amountNum <= 0) return alert("Enter a valid amount.");

    const reader = new FileReader();
    reader.onload = () => {
      const newEntry: CashEntry = {
        id: Date.now(),
        amount: amountNum,
        note: cashNote,
        date: new Date().toLocaleString(),
        image: reader.result as string | undefined,
      };
      setCashEntries([newEntry, ...cashEntries]);
      setCashAmount("");
      setCashNote("");
      setCashImage(null);
    };

    if (cashImage) {
      reader.readAsDataURL(cashImage);
    } else {
      const newEntry: CashEntry = {
        id: Date.now(),
        amount: amountNum,
        note: cashNote,
        date: new Date().toLocaleString(),
      };
      setCashEntries([newEntry, ...cashEntries]);
      setCashAmount("");
      setCashNote("");
      setCashImage(null);
    }
  };

  const totalCash = cashEntries.reduce((acc, e) => acc + e.amount, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Pretty Cash</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Amount"
              value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value)}
              className="text-base"
              type="number"
            />
            <Input
              placeholder="Note (optional)"
              value={cashNote}
              onChange={(e) => setCashNote(e.target.value)}
              className="text-base"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCashImage(e.target.files?.[0] || null)}
            />
          </div>

          <Button onClick={addCashEntry} className="w-full">
            Add Cash
          </Button>

          <div className="mt-4">
            <p className="font-medium text-gray-700 dark:text-gray-200">
              Total Cash: <span className="font-bold">{totalCash.toFixed(2)}</span>
            </p>

            {cashEntries.length > 0 ? (
              <ul className="mt-2 max-h-60 overflow-y-auto space-y-1">
                {cashEntries.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex flex-col gap-1 bg-gray-50 dark:bg-zinc-800 p-2 rounded-md border border-border text-sm"
                  >
                    <div className="flex justify-between">
                      <span>
                        {entry.amount.toFixed(2)} {entry.note ? `- ${entry.note}` : ""}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs">{entry.date}</span>
                    </div>
                    {entry.image && <Image src={entry.image} alt="Receipt" className="max-h-32 w-full object-contain rounded-md" />}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 mt-2 text-center">No cash entries yet.</p>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4 flex justify-end">
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
