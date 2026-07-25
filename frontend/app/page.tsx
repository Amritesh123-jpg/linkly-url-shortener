"use client"

import { Zap, Shield, BarChart3, Globe, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { UrlShortenerForm } from "@/components/url-shortener-form"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate shortened URLs in milliseconds with our optimized infrastructure.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with 99.9% uptime guarantee for all your links.",
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description: "Track clicks, geographic data, referrers, and more in real-time.",
  },
  {
    icon: Globe,
    title: "Custom Domains",
    description: "Use your own branded domain to create memorable short links.",
  },
]

const stats = [
  { value: "10M+", label: "Links Created" },
  { value: "500K+", label: "Active Users" },
  { value: "99.9%", label: "Uptime" },
  { value: "150+", label: "Countries" },
]

export default function HomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Shorten your links,{" "}
            <span className="text-primary">amplify your reach</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
            Transform long URLs into short, memorable links. Track performance with powerful analytics and manage all your links in one place.
          </p>

          <div className="mt-10 flex justify-center">
            <UrlShortenerForm />
          </div>

          {!isAuthenticated && (
            <p className="mt-6 text-sm text-muted-foreground">
              Want to track your links?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Create a free account
              </Link>
            </p>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-card px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary lg:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
              Everything you need to manage links
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Powerful features to help you create, track, and optimize your shortened URLs.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="border-t border-border bg-card px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Join thousands of users who trust Linkly for their URL shortening needs. Create your free account today.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup">
                <Button size="lg">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              2026 Linkly. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
