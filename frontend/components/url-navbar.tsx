"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Link2,
  LayoutDashboard,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function UrlNavbar() {
  const pathname = usePathname()

  const navigation = [
    {
      name: "Home",
      href: "/url",
      icon: Link2,
    },
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
    },
  ]

  return (
    <nav className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 py-2 sm:px-6 lg:px-8">
        {navigation.map((item) => {
          const Icon = item.icon

          const isActive = pathname === item.href

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}