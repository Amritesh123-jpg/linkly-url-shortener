import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
    />
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-16" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-14 flex-1" />
          <Skeleton className="h-14 flex-1" />
          <Skeleton className="h-14 w-24" />
          <Skeleton className="h-14 w-32" />
          <Skeleton className="h-14 w-16" />
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-2 h-8 w-32" />
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="mt-4 h-64 w-full" />
    </div>
  )
}
