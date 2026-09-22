"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiService } from "@/services/api";
import { RestoreDialog } from "@/components/restore-dialog";

export default function ExpiredTextsPage() {
  const [expiredTexts, setExpiredTexts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTexts, setTotalTexts] = useState(0);

  // Restore
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  const loadExpiredTexts = async (page: number = 1) => {
    setIsLoading(true);

    try {
      const result = await apiService.getExpiredTexts(page, 5);

      setExpiredTexts(result.texts);
      setCurrentPage(result.currentPage);
      setTotalPages(result.totalPages);
      setTotalTexts(result.totalTexts);
    } catch (error) {
      console.error("Failed to load expired texts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExpiredTexts(1);
  }, []);

  const handleRestore = async (expiry: string) => {
    if (!selectedTextId) return;

    setIsRestoring(true);

    try {
      await apiService.restoreText(selectedTextId, expiry);

      setRestoreDialogOpen(false);
      setSelectedTextId(null);

      // Reload current page after restore
      await loadExpiredTexts(currentPage);
    } catch (error) {
      console.error("Failed to restore text:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to restore text"
      );
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8">

          <Link
            href="/text"
            className="text-sm text-muted-foreground transition hover:text-foreground"
          >
            ← Back to Text Sharing
          </Link>

          <h1 className="mt-4 text-4xl font-bold">
            Expired Texts
          </h1>

          <p className="mt-2 text-muted-foreground">
            View and restore your expired shared texts.
          </p>

          {totalTexts > 0 && (
            <p className="mt-3 text-sm text-muted-foreground">
              Total Expired Texts: {totalTexts}
            </p>
          )}

        </div>

        {/* Loading */}
        {isLoading ? (

          <div className="rounded-xl border bg-card p-6 text-center">
            Loading expired texts...
          </div>

        ) : expiredTexts.length === 0 ? (

          /* Empty */
          <div className="rounded-xl border bg-card p-8 text-center">

            <p className="text-muted-foreground">
              You don't have any expired texts.
            </p>

            <Link
              href="/text"
              className="mt-4 inline-block cursor-pointer rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-all hover:scale-105 hover:brightness-110 active:scale-95"
            >
              Create Text
            </Link>

          </div>

        ) : (

          <>
            {/* List */}
            <div className="space-y-4">

              {expiredTexts.map((text) => (

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
                    <span className="text-sm font-medium text-red-500">
                      🔴 Expired
                    </span>
                  </div>

                  {/* Bottom */}
                  <div className="mt-4 flex items-center justify-between">

                    <span className="text-sm text-muted-foreground">
                      {text.shortCode}
                    </span>

                    <div className="flex gap-2">

                      {/* Restore */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTextId(text.id);
                          setRestoreDialogOpen(true);
                        }}
                        className="cursor-pointer rounded-lg border px-4 py-2 text-sm transition hover:bg-green-500/10 hover:text-green-500 active:scale-95"
                      >
                        Restore
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">

                <button
                  type="button"
                  disabled={currentPage === 1 || isLoading}
                  onClick={() =>
                    loadExpiredTexts(currentPage - 1)
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
                    loadExpiredTexts(currentPage + 1)
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

      {/* Restore Dialog */}
      <RestoreDialog
        open={restoreDialogOpen}
        onOpenChange={setRestoreDialogOpen}
        onConfirm={handleRestore}
        isLoading={isRestoring}
      />

    </main>
  );
}