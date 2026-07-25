"use client"

import { useState } from "react"
import { Copy, Check, Trash2, ExternalLink, MoreHorizontal, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import type { ShortenedUrl } from "@/services/api"
import { format, formatDistanceToNow } from "date-fns"
import { QrCode } from "lucide-react";
import { QrDialog } from "@/components/qr-dialog";

interface UrlTableProps {
  urls: ShortenedUrl[]
  onDelete: (id: string) => void
  onRestore: (id:string) =>void
  isDeleting?: string | null
}

export function UrlTable({ urls, onDelete,onRestore ,isDeleting }: UrlTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showQr, setShowQr] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<any>(null);

  const copyToClipboard = async (url: ShortenedUrl) => {
    try {
      await navigator.clipboard.writeText(url.shortUrl)
      setCopiedId(url.id)
      toast.success("Copied to clipboard!")
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      toast.error("Failed to copy to clipboard")
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy")
  }

  const getExpiryStatus = (expiresAt: string | null) => {
  if (!expiresAt) {
    return {
      text: "Never",
      className:
        "bg-slate-500/10 text-slate-400 border-slate-500/20",
    };
  }

  const expiry = new Date(expiresAt);
  const now = new Date();

  const diff = expiry.getTime() - now.getTime();

  if (diff <= 0) {
    return {
      text: "Expired",
      className:
        "bg-red-500/10 text-red-500 border-red-500/20",
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days > 7) {
    return {
      text: `${days}d Left`,
      className:
        "bg-green-500/10 text-green-500 border-green-500/20",
    };
  }

  if (days > 0) {
    return {
      text: `${days}d Left`,
      className:
        "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));

  return {
    text: `${hours}h Left`,
    className:
      "bg-orange-500/10 text-orange-500 border-orange-500/20",
  };
};

  if (urls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
        <p className="text-lg font-medium text-foreground">No URLs yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Start by shortening your first URL
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
      {/* Desktop Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-[1100px] w-full border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 border-b bg-muted/60 backdrop-blur supports-[backdrop-filter]:bg-muted/50">
            <tr>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Original URL
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Short URL
              </th>
              <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Clicks
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foregroundpx-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Expires
              </th>
              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {urls.map((url) => {
              const expiryStatus = getExpiryStatus(url.expiresAt)
              return (
                <tr key={url.id} className="group bg-card transition-all duration-200 hover:bg-muted/20">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted/30">
                        {url.favicon ? (
                          <img
                            src={url.favicon}
                            alt=""
                            className="h-6 w-6 rounded-md object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-primary/10 text-sm font-bold text-primary">
                            {(url.title || new URL(url.originalUrl).hostname)
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-semibold text-foreground">
                          {url.title || new URL(url.originalUrl).hostname}
                        </p>

                        <p className="mt-1 max-w-[420px] truncate text-xs text-muted-foreground">
                          {url.originalUrl}
                        </p>
                      </div>

                      <a
                        href={url.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex max-w-[240px] items-center rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm font-medium text-primary transition-all hover:bg-primary/10 hover:border-primary/40"
                    >
                      <span className="truncate">{url.shortUrl}</span>
                    </a>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex min-w-[60px] items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                      {url.clicks.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {expiryStatus && (
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${expiryStatus.className}`}
                      >
                        {expiryStatus.text}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-48">

                        <DropdownMenuItem onClick={() => copyToClipboard(url)}>
                          <Copy className="mr-2 h-4 w-4 text-muted-foreground" />
                          Copy Short URL
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => {
                            window.open(url.originalUrl, "_blank");
                          }}
                        >
                          <ExternalLink className="mr-2 h-4 w-4 text-muted-foreground" />
                          Open Original URL
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUrl(url);
                            setShowQr(true);
                          }}
                        >
                          <QrCode className="mr-2 h-4 w-4 text-muted-foreground" />
                          Show QR Code
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onRestore(url.id)}
                        >
                          <RotateCcw className="mr-2 h-4 w-4 text-muted-foreground" />
                          Restore
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onDelete(url.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                          Delete
                        </DropdownMenuItem>

                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <QrDialog
          open={showQr}
          onOpenChange={setShowQr}
          shortUrl={selectedUrl?.shortUrl || ""}
          urlId={selectedUrl?.id || ""}
          shortCode={selectedUrl?.shortCode || ""}
        />
      </div>

      {/* Mobile Cards */}
      <div className="divide-y divide-border md:hidden">
        {urls.map((url) => {
          const expiryStatus = getExpiryStatus(url.expiresAt)
          return (
            <div key={url.id} className="bg-card p-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <a
                    href={url.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    {url.shortUrl}
                  </a>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {url.originalUrl}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => copyToClipboard(url)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedUrl(url);
                        setShowQr(true);
                      }}
                    >
                      <QrCode className="mr-2 h-4 w-4" />
                      QR Code
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onRestore(url.id)}>
                      <RotateCcw className="mr-2 h-4 w-4" />
                        Restore
                      </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(url.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {url.clicks.toLocaleString()} clicks
                </span>
                {expiryStatus && (
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${expiryStatus.className}`}
                  >
                    {expiryStatus.text}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
