"use client";
import { useState ,useEffect} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface RestoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (duration: number) => void;
  isLoading?: boolean
}

export function RestoreDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading
}: RestoreDialogProps) {
  const [duration, setDuration] = useState(7);
  useEffect(() => {
  if (open) {
    setDuration(7);
  }
}, [open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Restore URL</DialogTitle>
          <DialogDescription>
            Select how long you want to restore this URL.
          </DialogDescription>
        </DialogHeader>

        {/* Duration options yaha aayenge */}

        
          <div className="space-y-3 py-4">
            <label className="flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer hover:bg-muted">
              <input
                type="radio"
                name="duration"
                checked={duration === 1}
                onChange={() => setDuration(1)}
              />
              <span>1 Day</span>
            </label>

            <label className="flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer hover:bg-muted">
              <input
                type="radio"
                name="duration"
                checked={duration === 7}
                onChange={() => setDuration(7)}
              />
              <span>7 Days</span>
            </label>

            <label className="flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer hover:bg-muted">
             <input
                type="radio"
                name="duration"
                checked={duration === 30}
                onChange={() => setDuration(30)}
              />
              <span>30 Days</span>
            </label>

            <label className="flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer hover:bg-muted">
              <input
                type="radio"
                name="duration"
                checked={duration === -1}
                onChange={() => setDuration(-1)}
              />
              <span>Never Expire</span>
            </label>
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            onClick={() => onConfirm(duration)}
            disabled={isLoading}
           >
            {isLoading ? "Restoring..." : "Restore"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}