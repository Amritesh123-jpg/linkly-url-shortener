"use client"

import { useEffect, useState, useCallback } from "react"
import {
  MousePointerClick,
  Link2,
  TrendingUp,
  ExternalLink,
  RefreshCw,
} from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/protected-route"
import { CardSkeleton, ChartSkeleton } from "@/components/skeleton-loader"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { apiService, type AnalyticsData } from "@/services/api"

function AnalyticsContent() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await apiService.getAnalytics()
      setAnalytics(data)
    } catch (error) {
      toast.error("Failed to fetch analytics")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Analytics
            </h1>
            <p className="mt-1 text-muted-foreground">
              Track performance and insights for your URLs
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchAnalytics} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                    <MousePointerClick className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Clicks</p>
                    <p className="text-2xl font-bold text-foreground">
                      {analytics?.totalClicks.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Link2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total URLs</p>
                    <p className="text-2xl font-bold text-foreground">
                      {analytics?.totalUrls || 0}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card p-6 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Clicks/URL</p>
                    <p className="text-2xl font-bold text-foreground">
                      {analytics?.averageClicks ?? 0}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Charts */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Clicks Over Time */}
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground">
                Clicks Over Time
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Click activity for the last 30 days
              </p>
              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics?.clicksOverTime || []}>
                    <defs>
                      <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.696 0.17 162.48)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.696 0.17 162.48)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(0.22 0 0)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.13 0 0)",
                        border: "1px solid oklch(0.22 0 0)",
                        borderRadius: "8px",
                        color: "oklch(0.985 0 0)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="clicks"
                      stroke="oklch(0.696 0.17 162.48)"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorClicks)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Top URLs */}
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground">
                Top Performing URLs
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your most clicked short links
              </p>
              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analytics?.topUrls || []}
                    layout="vertical"
                    margin={{ left: 0, right: 16 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(0.22 0 0)"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }}
                    />
                    <YAxis
                      type="category"
                      dataKey="shortCode"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }}
                      width={60}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.13 0 0)",
                        border: "1px solid oklch(0.22 0 0)",
                        borderRadius: "8px",
                        color: "oklch(0.985 0 0)",
                      }}
                      formatter={(value: number) => [value.toLocaleString(), "Clicks"]}
                    />
                    <Bar
                      dataKey="clicks"
                      fill="oklch(0.696 0.17 162.48)"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Top URLs Table */}
        {!isLoading && analytics && (
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Most Popular URLs
            </h2>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Rank
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Short Code
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Original URL
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                      Clicks
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {analytics.topUrls.map((url, index) => (
                    <tr key={url.shortCode} className="bg-card transition-colors hover:bg-muted/30">
                      <td className="px-4 py-4">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-mono text-sm text-primary">
                          {url.shortCode}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="max-w-[300px] truncate text-sm text-foreground">
                            {url.originalUrl}
                          </span>
                          <a
                            href={url.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="font-medium text-foreground">
                          {url.clicks.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <AnalyticsContent />
    </ProtectedRoute>
  )
}
