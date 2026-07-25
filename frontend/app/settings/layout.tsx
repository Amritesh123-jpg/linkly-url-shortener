import Link from "next/link";
import { User, Shield } from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <ProtectedRoute>
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="mb-8 text-3xl font-bold">Settings</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="w-60 rounded-xl border bg-card p-4">
          <nav className="space-y-2">
            {/* Links */}
          </nav>
        </aside>

        <main className="flex-1 rounded-xl border bg-card p-6">
          {children}
        </main>
      </div>
    </div>
  </ProtectedRoute>
  );
}