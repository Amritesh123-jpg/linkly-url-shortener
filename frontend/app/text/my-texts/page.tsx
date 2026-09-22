"use client";

import { DeleteDialog } from "@/components/delete-dialog";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiService } from "@/services/api";

export default function MyTextsPage() {
  const [texts, setTexts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTexts, setTotalTexts] = useState(0);

  const loadTexts = async (page: number = 1) => {
    setIsLoading(true);

    try {
      const result = await apiService.getMyTexts(page, 5);

      setTexts(result.texts);
      setCurrentPage(result.currentPage);
      setTotalPages(result.totalPages);
      setTotalTexts(result.totalTexts);
    } catch (error) {
      console.error("Failed to load texts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTexts(1);
  }, []);

  const handleDelete = async () => {
    if (!selectedTextId) return;

    setIsDeleting(true);

    try {
      await apiService.deleteText(selectedTextId);

      setDeleteDialogOpen(false);
      setSelectedTextId(null);

      await loadTexts(currentPage);
    } catch (error) {
      console.error("Failed to delete text:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete text"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopy = async (text: any) => {
    await navigator.clipboard.writeText(text.shareUrl);

    setCopiedId(text.id);

    setTimeout(() => {
      setCopiedId(null);
    }, 1500);
  };

  const renderTextCard = ( text: any ) => {
    return (
      <div
        key={text.id}
        className="rounded-xl border bg-card p-5 shadow-sm"
      >
        {/* Content */}
        <p className="line-clamp-3 whitespace-pre-wrap text-sm">
          {text.content}
        </p>

        {/* Status */}
        <div className="mt-3">
          <span className="text-sm font-medium text-green-500">
            🟢 Active
          </span>
        </div>

        {/* Bottom */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <span className="text-sm text-muted-foreground">
            {text.shortCode}
          </span>

          <div className="flex flex-wrap gap-2">

            {/* Copy */}
            <button
              type="button"
              onClick={() => handleCopy(text)}
              className="cursor-pointer rounded-lg border px-4 py-2 text-sm transition hover:bg-muted active:scale-95"
            >
              {copiedId === text.id
                ? "✓ Copied"
                : "Copy"}
            </button>

            {/* Share */}
            <button
              type="button"
              onClick={async () => {
                if (navigator.share) {
                  try {
                    await navigator.share({
                      title: "Shared Text",
                      text: "Check out this text shared via Linkly",
                      url: text.shareUrl,
                    });
                  } catch {
                    // User closed share dialog
                  }
                } else {
                  await navigator.clipboard.writeText(
                    text.shareUrl
                  );

                  setCopiedId(text.id);

                  setTimeout(() => {
                    setCopiedId(null);
                  }, 1500);
                }
              }}
              className="cursor-pointer rounded-lg border px-4 py-2 text-sm transition hover:bg-muted active:scale-95"
            >
              Share
            </button>

            {/* Open */}
            <a
                href={text.shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer rounded-lg border px-4 py-2 text-sm transition hover:bg-muted active:scale-95"
              >
                Open
            </a>

            {/* Delete */}
            <button
              type="button"
              onClick={() => {
                setSelectedTextId(text.id);
                setDeleteDialogOpen(true);
              }}
              className="cursor-pointer rounded-lg border px-4 py-2 text-sm transition hover:bg-red-500/10 hover:text-red-500 active:scale-95"
            >
              Delete
            </button>

          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen px-4 py-10">

      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-10">
          <Link
            href="/text"
            className="inline-flex items-center text-sm text-muted-foreground transition hover:text-foreground"
          >
            ← Back to Text Sharing
          </Link>

          <div className="mt-6">
            <h1 className="text-4xl font-bold tracking-tight">
              Your Texts
            </h1>

            <p className="mt-2 text-muted-foreground">
              Manage and organize your shared texts.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-6 inline-flex min-w-[180px] flex-col rounded-xl border bg-card px-6 py-4 shadow-sm">
            <span className="text-3xl font-bold">
              {totalTexts}
            </span>

            <span className="mt-1 text-sm text-muted-foreground">
              Active Texts
            </span>
          </div>
        </div>

        {/* Texts */}
        {isLoading ? (

          <div className="rounded-xl border bg-card p-6 text-center">
            Loading texts...
          </div>

        ) : texts.length === 0 ? (

          <div className="rounded-xl border bg-card p-8 text-center">

            <p className="text-muted-foreground">
              You haven't created any texts yet.
            </p>

            <Link
              href="/text"
              className="mt-4 inline-block rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
            >
              Create Text
            </Link>

          </div>

        ) : (

          <>

            {/* Total */}
            <div className="mb-8 text-sm text-muted-foreground">
              Total Texts: {totalTexts}
            </div>

            {/* Active Texts */}
            <section>
              <h2 className="mb-4 text-xl font-semibold">
                🟢 Active Texts
              </h2>

              <div className="space-y-4">
                {texts.map((text) => renderTextCard(text))}
              </div>
            </section>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">

                <button
                  type="button"
                  disabled={
                    currentPage === 1 ||
                    isLoading
                  }
                  onClick={() =>
                    loadTexts(currentPage - 1)
                  }
                  className="cursor-pointer rounded-lg border px-4 py-2 transition hover:bg-muted active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ← Previous
                </button>

                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={
                    currentPage === totalPages ||
                    isLoading
                  }
                  onClick={() =>
                    loadTexts(currentPage + 1)
                  }
                  className="cursor-pointer rounded-lg border px-4 py-2 transition hover:bg-muted active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next →
                </button>

              </div>
            )}

          </>

        )}

      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        type="Text"
      />

    </main>
  );
}