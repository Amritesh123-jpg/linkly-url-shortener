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

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete URL</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete this URL?
            <br />
            You can restore it later.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="
              cursor-pointer
              border-neutral-700
              bg-transparent
              text-neutral-300
              transition-all
              duration-200
              hover:bg-white/10
              hover:border-white/30
              hover:text-white
              hover:scale-105
              active:scale-95
            "
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className={`transition-all duration-200 active:scale-95 ${
              isLoading
                ? "cursor-not-allowed"
                : "cursor-pointer hover:scale-105"
            }`}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}