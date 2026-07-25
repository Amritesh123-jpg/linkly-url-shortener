"use client"

import { useState } from "react"
import { Link2, Copy, Check, ExternalLink ,QrCode} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { apiService, type ShortenedUrl } from "@/services/api"
import { QrDialog } from "@/components/qr-dialog";

export function UrlShortenerForm() {
  const [url, setUrl] = useState("")
  const [customAlias, setCustomAlias] = useState("");
  const [tag, setTag] = useState("");
  const [expiry, setExpiry] = useState("30d");
  const [isLoading, setIsLoading] = useState(false)
  const [shortenedUrl, setShortenedUrl] = useState<ShortenedUrl | null>(null)
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      toast.error("Please enter a URL")
      return
    }

    // Basic URL validation
   

    setIsLoading(true)
    try {
      const result = await apiService.shortenUrl(
        url,
        customAlias || undefined,
        tag || undefined,
        expiry
      );
      setShortenedUrl(result);
      setUrl("");
      setCustomAlias("");
      setTag("");
      setExpiry("30d");
      setCopied(false);
      toast.success("URL shortened successfully!")
    } catch (error) {
      toast.error("Failed to shorten URL. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (!shortenedUrl) return

    try {
      await navigator.clipboard.writeText(shortenedUrl.shortUrl)
      setCopied(true)
      toast.success("Copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Failed to copy to clipboard")
    }
  }

  const handleReset = () => {
    setUrl("")
    setShortenedUrl(null)
    setCopied(false)
  }

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Link2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Paste your long URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-12 pl-10 text-base"
            disabled={isLoading}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            type="text"
            placeholder="Custom alias (optional)"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            disabled={isLoading}
            className="h-12"
          />

          <Input
            type="text"
            placeholder="Tag (optional)"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            disabled={isLoading}
            className="h-12"
          />
        <div className="w-full">
          <Select
            value={expiry}
            onValueChange={setExpiry}
            disabled={isLoading}
          >
            <SelectTrigger className="h-12 w-full">
              <SelectValue placeholder="Select expiry" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="5m">5 Minutes</SelectItem>
              <SelectItem value="10m">10 Minutes</SelectItem>
              <SelectItem value="30m">30 Minutes</SelectItem>
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="1d">1 Day</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="never">Never Expire</SelectItem>
            </SelectContent>
          </Select>
        </div>
          <Button
            type="submit"
            size="lg"
            className="h-12"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner className="mr-2" />
                Shortening...
              </>
            ) : (
              "Shorten URL"
            )}
          </Button>
        </div>
      </form>

      {shortenedUrl && (
        <div className="mt-6 rounded-lg border border-border bg-card p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted-foreground">Your shortened URL</p>
              <div className="mt-1 flex items-center gap-2">
                <a
                  href={shortenedUrl.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-lg font-medium text-primary hover:underline"
                >
                  {shortenedUrl.shortUrl}
                </a>
                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
              </div>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                Original: {shortenedUrl.originalUrl}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQr(true)}
              >
                <QrCode className="mr-2 h-4 w-4" />
                Show QR
              </Button>

              <Button size="sm" asChild>
                <a
                  href={shortenedUrl.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
      <QrDialog
        open={showQr}
        onOpenChange={setShowQr}
        shortUrl={shortenedUrl?.shortUrl || ""}
        urlId={shortenedUrl?.id || ""}
        shortCode={shortenedUrl?.shortCode || ""}
      />
    </div>
  )
}
