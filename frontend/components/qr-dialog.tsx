"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
   DialogDescription,
} from "@/components/ui/dialog";
import { QrCode } from "lucide-react";


interface QrDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shortUrl: string;
  urlId: string;
  shortCode: string;
}

export function QrDialog({
  open,
  onOpenChange,
  shortUrl,
  urlId,
  shortCode,
}: QrDialogProps) {
  const [qrImage, setQrImage] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
          if (!open || !urlId) return;

          const fetchQr = async () => {
            try {
              setLoading(true);

              const token = sessionStorage.getItem("token");

              const response = await  apiService.getQrCode(urlId);

              if (!response.ok) {
                  console.log("Status:", response.status);

                  const text = await response.text();
                  console.log(text);

                  throw new Error("Failed to load QR code");
                }

              const blob = await response.blob();
              const imageUrl = URL.createObjectURL(blob);

              setQrImage(imageUrl);
            } catch (error) {
              console.error(error);
            } finally {
              setLoading(false);
            }
          };

          fetchQr();

          return () => {
            if (qrImage) {
              URL.revokeObjectURL(qrImage);
            }
          };
        }, [open, urlId]);

         const downloadQr = () => {
            if (!qrImage) return;

            const link = document.createElement("a");
            link.href = qrImage;
            link.download = `${shortCode}-qr.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>

          <DialogDescription>
            Scan this QR code or download it to access the shortened URL.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-6">
          <div className="flex h-56 w-56 items-center justify-center rounded-lg border">
            {loading ? (
              <p className="text-sm text-muted-foreground">
                Loading QR...
              </p>
            ) : qrImage ? (
              <img
                src={qrImage}
                alt="QR Code"
                className="h-full w-full rounded-lg object-contain"
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Failed to load QR Code
              </p>
            )}
          </div>

          <p className="text-center text-sm text-muted-foreground break-all">
            {shortUrl}
          </p>
          <Button
            onClick={downloadQr}
            className="w-full"
            disabled={!qrImage || loading}
          >
            Download QR
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}