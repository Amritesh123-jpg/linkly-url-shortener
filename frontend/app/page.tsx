"use client";

import {
  Link as LinkIcon,
  FileText,
  FolderOpen,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary">
            Welcome to Linkly
          </p>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Share{" "}
            <span className="text-primary">anything</span>
            <br />
            with Linkly
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
            One simple platform to shorten URLs, share text, and
            securely share files.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Linkly Services
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Choose what you want to share.
            </p>
          </div>

          {/* Horizontal Cards */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">

            {/* URL Shortener */}
            <Link
              href="/url"
              className="group rounded-2xl border border-border bg-card p-7 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-green-500/50 hover:shadow-lg"
            >
              {/* Signal */}
              <div className="mb-6 flex justify-center">
                <div className="h-5 w-5 rounded-full bg-green-500 shadow-[0_0_16px_rgba(34,197,94,0.8)]" />
              </div>

              {/* Icon */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10">
                <LinkIcon className="h-8 w-8 text-green-500" />
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                URL Shortener
              </h3>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Create short, memorable URLs and track their
                performance with powerful analytics.
              </p>

              <div className="mt-6 text-sm font-medium text-green-500">
                Fully Active →
              </div>
            </Link>

            {/* Text Sharing */}
            <Link
              href="/text"
              className="group rounded-2xl border border-border bg-card p-7 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-green-500/50 hover:shadow-lg"
            >
              {/* Signal */}
              <div className="mb-6 flex justify-center">
                <div className="h-5 w-5 rounded-full bg-green-500 shadow-[0_0_16px_rgba(34,197,94,0.8)]" />
              </div>

              {/* Icon */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10">
                <FileText className="h-8 w-8 text-green-500" />
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                Text Sharing
              </h3>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Share text instantly with a secure and
                convenient short link.
              </p>

              <div className="mt-6 text-sm font-medium text-green-500">
                Fully Active →
              </div>
            </Link>

            {/* File Sharing */}
            <div className="rounded-2xl border border-border bg-card p-7 text-center opacity-90">
              {/* Signal */}
              <div className="mb-6 flex justify-center">
                <div className="h-5 w-5 rounded-full bg-red-500 shadow-[0_0_16px_rgba(239,68,68,0.8)]" />
              </div>

              {/* Icon */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
                <FolderOpen className="h-8 w-8 text-red-500" />
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                File Sharing
              </h3>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Share files securely with fast and simple
                downloadable links.
              </p>

              <div className="mt-6 text-sm font-medium text-red-500">
                Coming Soon
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* About Linkly */}
      <section className="border-y border-border bg-card px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">

          <h2 className="text-3xl font-bold text-foreground">
            One platform. Multiple ways to share.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
            Linkly brings your links, text, and files together
            in one place. Create, manage, and share everything
            from a single platform.
          </p>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">

            <p className="text-sm text-muted-foreground">
              © 2026 Linkly. All rights reserved.
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
  );
}