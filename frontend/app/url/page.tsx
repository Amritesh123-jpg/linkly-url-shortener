"use client"

import { Header } from "@/components/header"
import { UrlNavbar } from "@/components/url-navbar"
import { UrlShortenerForm } from "@/components/url-shortener-form"

export default function UrlPage() {
  return (
    <div className="min-h-screen">
      {/* Global Header */}
      <Header />

      {/* URL Shortener Navigation */}
      <UrlNavbar />

      {/* URL Shortener Hero */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl text-center">

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Shorten your links,{" "}
            <span className="text-primary">
              amplify your reach
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
            Transform long URLs into short, memorable links.
            Track performance with powerful analytics and manage
            all your links in one place.
          </p>

          {/* URL Shortener Form */}
          <div className="mt-10 flex justify-center">
            <UrlShortenerForm />
          </div>

        </div>
      </section>
    </div>
  )
}