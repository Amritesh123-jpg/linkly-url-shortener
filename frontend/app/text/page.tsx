"use client";

import { Header } from "@/components/header";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiService } from "@/services/api";

export default function TextPage() {
  const router = useRouter();

  const [content, setContent] = useState("");
  const [expiry, setExpiry] = useState("30d");
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check authentication
  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setIsCheckingAuth(false);
  }, [router]);

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert("Please enter some text");
      return;
    }

    setIsLoading(true);

    try {
      const result = await apiService.createText(
        content,
        expiry
      );

      setShareUrl(result.shareUrl);
      setExpiry("30d");
      setContent("");
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to create text"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!shareUrl) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Shared Text",
          text: "Check out this text shared via Linkly",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Share is not supported. Link copied instead.");
      }
    } catch (error) {
      // User closed the share dialog
    }
  };

  // While checking authentication
  if (isCheckingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">
          Checking authentication...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-10">
      <Header />

      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold">
            Text Sharing
          </h1>

          <p className="mt-2 text-muted-foreground">
            Share text instantly with a secure short link.
          </p>
        </div>

        {/* Create Text Card */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              Your Text
            </label>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write or paste your text here..."
              className="min-h-[220px] w-full resize-y rounded-lg border bg-background p-4 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Expiry + Button */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">

            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium">
                Expiry
              </label>

              <select
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="5m">5 Minutes</option>
                <option value="10m">10 Minutes</option>
                <option value="30m">30 Minutes</option>
                <option value="1h">1 Hour</option>
                <option value="1d">1 Day</option>
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
                <option value="never">Never Expire</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="
                h-11
                cursor-pointer
                rounded-lg
                bg-primary
                px-6
                font-medium
                text-primary-foreground
                transition-all
                duration-200
                hover:scale-105
                hover:brightness-110
                active:scale-95
                disabled:cursor-not-allowed
                disabled:opacity-50
                disabled:hover:scale-100
              "
            >
              {isLoading ? "Creating..." : "Create Text"}
            </button>

          </div>
        </div>

        {/* Share URL */}
        {shareUrl && (
          <div className="mt-6 rounded-xl border bg-card p-6 shadow-sm">

            <h2 className="text-lg font-semibold">
              Text Created Successfully 🎉
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Share this link with anyone:
            </p>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="
                  w-full
                  rounded-lg
                  border
                  bg-background
                  px-4
                  py-3
                  outline-none
                  focus:ring-0
                  focus:outline-none
                "
              />

              <button
                type="button"
                onClick={async () => {
                  if (!shareUrl) return;

                  await navigator.clipboard.writeText(shareUrl);

                  setCopied(true);

                  setTimeout(() => {
                    setCopied(false);
                  }, 1500);
                }}
                className="
                  cursor-pointer
                  rounded-lg
                  border
                  px-5
                  py-3
                  text-sm
                  font-medium
                  transition-all
                  duration-200
                  hover:scale-105
                  hover:bg-primary/10
                  active:scale-95
                "
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="
                  cursor-pointer
                  rounded-lg
                  border
                  px-5
                  py-3
                  font-medium
                  transition-all
                  duration-200
                  hover:scale-105
                  hover:bg-primary/10
                  active:scale-95
                "
              >
                Share
              </button>

            </div>

            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-medium underline"
            >
              Open Text
            </a>

          </div>
        )}

        {/* Navigation Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">

          {/* Your Texts */}
          <Link
            href="/text/my-texts"
            className="rounded-xl border bg-card p-6 shadow-sm transition hover:bg-muted"
          >
            <h2 className="text-lg font-semibold">
              📝 Your Texts
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              View and manage all your shared texts.
            </p>

            <span className="mt-4 inline-block text-sm font-medium">
              Manage Texts →
            </span>
          </Link>

          {/* Expired Texts */}
          <Link
            href="/text/expired"
            className="rounded-xl border bg-card p-6 shadow-sm transition hover:bg-muted/40"
          >
            <h2 className="text-lg font-semibold">
              ⏳ Expired Texts
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              View and restore your expired texts.
            </p>

            <span className="mt-4 inline-block text-sm font-medium">
              View Expired →
            </span>
          </Link>

        </div>

      </div>
    </main>
  );
}