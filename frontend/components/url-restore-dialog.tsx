"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface UrlRestoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (duration: number) => void;
  isLoading?: boolean;
}

export function UrlRestoreDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: UrlRestoreDialogProps) {
  const [duration, setDuration] = useState(30);

  const handleRestore = () => {
    onConfirm(duration);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Restore URL</DialogTitle>

          <DialogDescription>
            Choose how long this URL should remain active after restoration.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <label className="text-sm font-medium">
            Expiry
          </label>

          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            disabled={isLoading}
            className="w-full cursor-pointer rounded-lg border bg-background px-3 py-2 text-sm outline-none"
          >
            <option value={1}>1 Day</option>
            <option value={7}>7 Days</option>
            <option value={30}>30 Days</option>
            <option value={-1}>Never</option>
          </select>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleRestore}
            disabled={isLoading}
            className="cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            {isLoading ? "Restoring..." : "Restore"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}