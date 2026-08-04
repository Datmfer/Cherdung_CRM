"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { name: "Dashboard", href: "/support/dashboard", icon: "📊" },
  { name: "My Tickets", href: "/support/my-tickets", icon: "🎫" },
  { name: "All Tickets", href: "/support/tickets", icon: "📋" },
  { name: "User Lookup", href: "/support/user-lookup", icon: "🔍" },
  { name: "Knowledge Base", href: "/support/kb", icon: "📚" },
];

export default function SupportSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();

  return (
    <aside className="w-64 bg-cyan-900 dark:bg-black text-white min-h-screen p-6 flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-cyan-400">Support Panel</h2>
        <p className="text-sm text-gray-400 mt-1">Cherdung CRM</p>
        {user && (
          <p className="text-xs text-gray-500 mt-2">
            Logged in as: {user.name}
          </p>
        )}
      </div>

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-cyan-600 text-white"
                  : "text-gray-300 hover:bg-cyan-800 hover:text-white"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-2">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-cyan-800 hover:text-white transition-colors w-full text-left"
        >
          <span className="text-xl">🏠</span>
          <span className="font-medium">Back to Site</span>
        </button>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-cyan-800 hover:text-white transition-colors w-full text-left"
        >
          <span className="text-xl">🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
