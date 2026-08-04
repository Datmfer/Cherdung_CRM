"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const activeClass =
    "text-indigo-600 relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-indigo-600";
  const inactiveClass =
    "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors";

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:bg-[#111827]/80 dark:border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
            C
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Cherdung CRM
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Investment Platform
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <ul className="hidden md:flex items-center gap-10 font-medium">
          <li>
            <Link
              href="/"
              className={pathname === "/" ? activeClass : inactiveClass}
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              href="/investment-plans"
              className={
                pathname === "/investment-plans" ? activeClass : inactiveClass
              }
            >
              Investment Plans
            </Link>
          </li>

          <li>
            <Link
              href="/how-it-works"
              className={
                pathname === "/how-it-works" ? activeClass : inactiveClass
              }
            >
              How It Works
            </Link>
          </li>

          <li>
            <Link
              href="/about-us"
              className={pathname === "/about-us" ? activeClass : inactiveClass}
            >
              About Us
            </Link>
          </li>

          <li>
            <Link
              href="/contact"
              className={pathname === "/contact" ? activeClass : inactiveClass}
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {loading ? null : user ? (
            <>
              <div className="hidden sm:flex flex-col items-end text-right">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user.name}
                </span>
                <span className="text-xs capitalize text-gray-500 dark:text-gray-400">
                  {user.role}
                </span>
              </div>

              <Link
                href={
                  user.role === "admin"
                    ? "/admin/dashboard"
                    : user.role === "support"
                      ? "/support/dashboard"
                      : "/user-dashboard/dashboard"
                }
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-white font-semibold shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all duration-300"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:block text-gray-700 dark:text-gray-300 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Login
              </Link>

              <Link
                href="/login"
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-white font-semibold shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all duration-300"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
