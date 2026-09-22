"use client"

import Link from "next/link"
import { Link2, LogOut, Menu, X, User, Shield } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Link2 className="h-4 w-4 text-primary-foreground" />
          </div>

          <span className="text-xl font-semibold text-foreground">
            Linkly
          </span>
        </Link>

        {/* Desktop User */}
        <div className="hidden items-center gap-4 md:flex">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-3 rounded-xl px-3 py-2 transition-all duration-200 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-muted font-semibold text-foreground">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <span className="text-sm font-medium text-foreground">
                    {user?.name}
                  </span>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56 rounded-xl"
              >
                <DropdownMenuLabel className="py-3">
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {user?.name}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link
                    href="/settings/profile"
                    className="flex cursor-pointer items-center"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href="/settings/security"
                    className="flex cursor-pointer items-center"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Security</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-red-500 focus:text-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>

              <Link href="/signup">
                <Button size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border md:hidden">
          <div className="space-y-2 px-4 py-4">

            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-muted font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="text-sm font-medium">
                      {user?.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-2">
                  <Link
                    href="/settings/profile"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                  </Link>

                  <Link
                    href="/settings/security"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Security
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-red-500"
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                  >
                    Login
                  </Button>
                </Link>

                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    size="sm"
                    className="w-full"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

          </div>
        </div>
      )}
    </header>
  )
}