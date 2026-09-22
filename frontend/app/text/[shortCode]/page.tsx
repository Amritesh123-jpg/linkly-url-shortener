"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/services/api";

interface SharedText {
  content: string;
  shortCode: string;
  expiresAt: string | null;
}

export default function SharedTextPage({
  params,
}: {
  params: Promise<{ shortCode: string }>;
}) {
  const [text, setText] = useState<SharedText | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadText = async () => {
      try {
        const { shortCode } = await params;

        const result = await apiService.getText(shortCode);

        setText(result);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Text not found";

        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadText();
  }, [params]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <p className="text-muted-foreground">
          Loading text...
        </p>
      </main>
    );
  }

  if (error || !text) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-2xl rounded-xl border bg-card p-8 text-center">
          <h1 className="text-2xl font-bold">
            Text Not Found
          </h1>

          <p className="mt-3 text-muted-foreground">
            {error ||
              "This text does not exist or is no longer available."}
          </p>
        </div>
      </main>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text.content);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">
            Shared Text
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Shared via Linkly
          </p>
        </div>

        {/* Text Card */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">

          {/* Text Container */}
          <div className="relative rounded-lg border bg-background p-5">

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? "Copied" : "Copy text"}
              title={copied ? "Copied" : "Copy text"}
              className="absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border bg-background text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95"
            >
              {copied ? (
                <span className="text-sm font-semibold">
                  ✓
                </span>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect
                    width="14"
                    height="14"
                    x="8"
                    y="8"
                    rx="2"
                    ry="2"
                  />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
              )}
            </button>

            {/* Shared Text */}
            <p className="whitespace-pre-wrap break-words pr-12 text-sm leading-7">
              {text.content}
            </p>

          </div>

        </div>
      </div>
    </main>
  );
}