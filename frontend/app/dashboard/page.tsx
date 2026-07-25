"use client"
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState, useCallback } from "react"
import { Plus, Link2, MousePointerClick, RefreshCw, Trophy,BarChart3 } from "lucide-react"
import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/protected-route"
import { UrlTable } from "@/components/url-table"
import { UrlShortenerForm } from "@/components/url-shortener-form"
import { TableSkeleton, CardSkeleton } from "@/components/skeleton-loader"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { apiService, type ShortenedUrl, type DashboardStats } from "@/services/api"
import { RestoreDialog } from "@/components/restore-dialog"
import { DeleteDialog } from "@/components/delete-dialog";
import { SearchX } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  
} from "@/components/ui/dialog";
import { TagFilter } from "@/components/tag-filter";

function DashboardContent() {
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [selectedUrlId, setSelectedUrlId] = useState<string | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  const [isRestoring, setIsRestoring] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
  totalUrls: 0,
  totalClicks: 0,
  activeUrls: 0,
  expiredUrls: 0,
  mostClickedUrl: null,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "expired">("all");
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "clicks">("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTag, setSelectedTag] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [topLinksOpen, setTopLinksOpen] = useState(false);

  const fetchUrls = useCallback(async () => {
  setIsLoading(true);

  const sort =
    sortBy === "latest"
      ? "-createdAt"
      : sortBy === "oldest"
      ? "createdAt"
      : "-clicks";

  try {
    const data = await apiService.getUrls(
      currentPage,
      10,
      searchTerm,
      sort,
      filter,
      selectedTag
    );

    setUrls(data.urls);
   // setCurrentPage(data.currentPage);
    setTotalPages(data.totalPages);
  } catch (error) {
    toast.error("Failed to fetch URLs");
  } finally {
    setIsLoading(false);
  }
}, [currentPage, searchTerm, sortBy, filter,selectedTag]);

  const fetchDashboardStats = async () => {
  try {
    const data = await apiService.getDashboardStats();
    console.log("Most Clicked URL:", data.mostClickedUrl);
    setStats(data);
  } catch (error) {
    console.error("Failed to fetch dashboard stats", error);
    toast.error("Failed to fetch dashboard stats");
  }
};

   const fetchTags = async () => {
  try {
    const data = await apiService.getTags();
    setTags(data.tags);
  } catch (error) {
    console.error(error);
  }
  };


  
  useEffect(() => {
  setCurrentPage(1);
}, [filter, searchTerm, sortBy,selectedTag]);

useEffect(() => {
  fetchUrls();
}, [fetchUrls]);

useEffect(() => {
  fetchDashboardStats();
  fetchTags();
}, []);
  

  const handleDelete = (id: string) => {
  setSelectedDeleteId(id);
  setDeleteOpen(true);
};

  const handleRestore = (id:string)=>{
    setSelectedUrlId(id);
    setRestoreOpen(true);
    }



//     const filteredUrls = urls.filter((url) => {
//   const search = searchTerm.trim().toLowerCase();

//   const matchesSearch =
//     url.originalUrl.toLowerCase().includes(search) ||
//     url.shortCode.toLowerCase().includes(search);

//   const isExpired =
//   url.expiresAt !== null && new Date(url.expiresAt) <= new Date();

//   const matchesFilter =
//     filter === "all" ||
//     (filter === "active" && !isExpired) ||
//     (filter === "expired" && isExpired);

//   return matchesSearch && matchesFilter;
// });

// const sortedUrls = [...filteredUrls].sort((a, b) => {
//   switch (sortBy) {
//     case "latest":
//       return (
//         new Date(b.createdAt).getTime() -
//         new Date(a.createdAt).getTime()
//       );

//     case "oldest":
//       return (
//         new Date(a.createdAt).getTime() -
//         new Date(b.createdAt).getTime()
//       );

//     case "clicks":
//       return b.clicks - a.clicks;

//     default:
//       return 0;
//   }
// });


 // const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0)

  return (
    <div className="min-h-screen">
      <Header />
    
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Dashboard
            </h1>

            <p className="mt-2 text-muted-foreground">
              Manage, track and analyze all your shortened links from one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={async () => {
                await Promise.all([
                  fetchUrls(),
                  fetchDashboardStats(),
                ]);
              }}
              disabled={isLoading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${
                  isLoading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </Button>

            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4"/>
              Shorten URL
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : (
            <>
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Link2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total URLs</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalUrls}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <MousePointerClick className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.totalClicks.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card p-6 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <MousePointerClick className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                        Active URLs
                    </p>

                    <p className="text-2xl font-bold text-foreground">
                        {stats.activeUrls}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                    <MousePointerClick className="h-5 w-5 text-destructive" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Expired URLs
                    </p>

                    <p className="text-2xl font-bold text-foreground">
                      {stats.expiredUrls}
                    </p>
                  </div>
                </div>
              </div>

            </>
          )}
        </div>
         
         {stats.mostClickedUrl && (
            <div
              onClick={() => setTopLinksOpen(true)}
              className="group relative mt-8 cursor-pointer rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              {/* Default Card */}
              <div className="space-y-5">

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-6 w-6 text-yellow-500" />
                      <h2 className="text-lg font-semibold">
                        Top Performing Link
                      </h2>
                    </div>

                    <span className="rounded-full bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-500">
                      🥇
                    </span>
                  </div>

                  <span className="text-sm font-medium text-primary">
                    View Details →
                  </span>
                </div>

                <div className="mt-6 space-y-4">

                  <div className="flex items-center gap-3">

                    <img
                      src={
                        stats.mostClickedUrl.favicon ||
                        `https://www.google.com/s2/favicons?sz=64&domain_url=${stats.mostClickedUrl.originalUrl}`
                      }
                      alt=""
                      className="h-10 w-10 rounded-lg border"
                    />

                    <div>

                      <p className="font-semibold">
                        {stats.mostClickedUrl.title || "Untitled"}
                      </p>

                      <p className="text-sm text-muted-foreground truncate">
                        {new URL(stats.mostClickedUrl.originalUrl).hostname}
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center justify-between">

                    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                      👆 {stats.mostClickedUrl.clicks} Clicks
                    </span>

                    

                  </div>

                </div>

              </div>

              {/* Hover Card */}
              

            </div>
          )}

        {/* URL Shortener Form */}
        

        {/* URL Table */}
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Your URLs</h2>
          {isLoading ? (
            <TableSkeleton rows={5} />
          ) : (
          <>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  placeholder="Search by URL or Short Code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <select
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value as "all" | "active" | "expired")
                }
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
              </select>
              <TagFilter
                tags={tags}
                selectedTags={selectedTag}
                onChange={setSelectedTag}
              />

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "latest" | "oldest" | "clicks")
                }
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="clicks">Most Clicked</option>
              </select>

            </div>
            {urls.length === 0 ? (
               <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
                  <SearchX className="mb-4 h-12 w-12 text-muted-foreground" />

                  <h3 className="text-lg font-semibold">No URLs Found</h3>

                  <p className="mt-2 max-w-sm text-sm font-medium text-muted-foreground">
                    We couldn't find any URLs matching your current search or filter.
                  </p>

                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => {
                      setSearchTerm("");
                      setFilter("all");
                      setSortBy("latest");
                    }}
                  >
                    Clear Filters
                  </Button>
               </div>
            ) : (
            <>  
              <UrlTable
                urls={urls}
                onDelete={handleDelete}
                onRestore={handleRestore}
                isDeleting={isDeleting}
              />
              <div className="mt-6 flex items-center justify-between">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </Button>

                <span className="text-sm font-medium text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>
            </>  
            )}
          </>  
          )}
        </div>
      </main>
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="w-full max-w-[900px] rounded-2xl p-0 overflow-hidden  top-[90px] translate-y-0 ">
          <DialogHeader className="border-b px-6 py-4">
            <DialogTitle className="text-xl font-bold">
              🔗 Shorten New URL
            </DialogTitle>
          </DialogHeader>

          <div className="p-6">
            <UrlShortenerForm />
          </div>
        </DialogContent>
      </Dialog>
       <Dialog open={topLinksOpen} onOpenChange={setTopLinksOpen}>
        <DialogContent className="max-w-3xl rounded-2xl">

          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Top Performing Link
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">

            <div className="rounded-xl border p-4 hover:bg-muted/40 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">

                  <img
                    src={stats.mostClickedUrl?.favicon}
                    alt={stats.mostClickedUrl?.title}
                    className="h-12 w-12 rounded-lg border object-cover"
                  />

                  <div>

                    <p className="text-lg font-semibold">
                      {stats.mostClickedUrl?.title}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {stats.mostClickedUrl
                      ? new URL(stats.mostClickedUrl.originalUrl).hostname
                      : ""}
                    </p>

                  </div>

                </div>

                <div className="rounded-lg bg-primary/10 px-4 py-2 text-center">
                  <p className="text-lg font-bold text-primary">
                    👆 {stats.mostClickedUrl?.clicks} Clicks
                  </p>
                </div>
              </div>
              <p className="mt-4 mb-2 text-sm font-medium text-muted-foreground">
                Short URL
              </p>

              <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">

                <code className="truncate text-sm">
                   {`${process.env.NEXT_PUBLIC_API_URL}/${stats.mostClickedUrl?.shortCode}`}
                </code>

                <Button
                  size="default"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `{process.env.NEXT_PUBLIC_API_URL}/${stats.mostClickedUrl?.shortCode}`
                    );
                    toast.success("Copied!");
                  }}
                >
                  Copy
                </Button>

              </div>
              <div className="mt-6 flex justify-end">
                <Button className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  View Analytics
                </Button>
              </div>

            </div>

          </div>

        </DialogContent>
      </Dialog>

      <RestoreDialog
        open={restoreOpen}
        onOpenChange={setRestoreOpen}
        isLoading={isRestoring}
        onConfirm={async (duration) => {
          if (!selectedUrlId) return;
          setIsRestoring(true);
          try {
            await apiService.restoreUrl(selectedUrlId, duration);

            toast.success("URL restored successfully");

            setRestoreOpen(false);
            setSelectedUrlId(null);
            await Promise.all([
              fetchUrls(),
              fetchDashboardStats(),
            ]);
          } catch (error) {
            toast.error("Failed to restore URL");
          } finally{
            setIsRestoring(false);
          }
        }}
      />
    <DeleteDialog
      open={deleteOpen}
      onOpenChange={setDeleteOpen}
      isLoading={isDeleting === selectedDeleteId}
      onConfirm={async () => {
        if (!selectedDeleteId) return;

        setIsDeleting(selectedDeleteId);

        try {
          await apiService.deleteUrl(selectedDeleteId);

          toast.success("URL deleted successfully");

          setDeleteOpen(false);
          setSelectedDeleteId(null);

          await Promise.all([
          fetchUrls(),
          fetchDashboardStats(),
        ]);
        } catch (error) {
          toast.error("Failed to delete URL");
        } finally {
          setIsDeleting(null);
        }
      }}
    />

    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
